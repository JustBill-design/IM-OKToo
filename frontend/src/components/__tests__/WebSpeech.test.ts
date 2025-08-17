import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import Chatbot from '../ChatbotWithSpeech.vue'; 
import { nextTick } from 'vue';


class MockSpeechRecognition {
  onresult: ((event: any) => void) | null = null;
  onerror: ((event: any) => void) | null = null;
  onend: (() => void) | null = null;
  lang: string = '';
  interimResults: boolean = false;
  maxAlternatives: number = 1;

  start = vi.fn(() => {
    // Simulate recognition starting
    console.log('Mock SpeechRecognition started');
  });
  stop = vi.fn(() => {
    // Simulate recognition stopping
    console.log('Mock SpeechRecognition stopped');
  });
  abort = vi.fn(() => {
    console.log('Mock SpeechRecognition aborted');
  });

  // mock result
  _triggerResult(transcript: string) {
    if (this.onresult) {
      this.onresult({
        results: [[{ transcript: transcript, confidence: 0.9 }]]
      });
    }
  }

  //mock error
  _triggerError(error: any) {
    if (this.onerror) {
      this.onerror(error);
    }
  }

  //end event
  _triggerEnd() {
    if (this.onend) {
      this.onend();
    }
  }
}

// mock ai response
global.fetch = vi.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({ reply: 'Mock AI response' }),
    status: 200,
  } as Response)
);

// --- Chatbot STT Test Suite ---
describe('Chatbot Speech-to-Text functionality', () => {
  let mockRecognitionInstance: MockSpeechRecognition;
  let mockSpeechRecognitionConstructor: vi.Mock;
  let mockWebkitSpeechRecognitionConstructor: vi.Mock;

  beforeEach(() => {
    vi.clearAllMocks();

    mockRecognitionInstance = new MockSpeechRecognition();
    mockSpeechRecognitionConstructor = vi.fn(() => mockRecognitionInstance);
    mockWebkitSpeechRecognitionConstructor = vi.fn(() => mockRecognitionInstance);

    // Mock the global SpeechRecognition and webkitSpeechRecognition constructors

    Object.defineProperty(window, 'SpeechRecognition', {
      writable: true,
      value: mockSpeechRecognitionConstructor,
    });
    Object.defineProperty(window, 'webkitSpeechRecognition', {
      writable: true,
      value: mockWebkitSpeechRecognitionConstructor,
    });
  });

  // --- Core Functionality Tests ---
  describe('Core STT Integration', () => {
    it('should start speech recognition when button is clicked', async () => {
      const wrapper = mount(Chatbot);
      // Attempt to find button by aria-label first, then fallback to class
      let speechButton = wrapper.find('button[aria-label="Start Speech Recognition"]');
      if (!speechButton.exists()) {
        speechButton = wrapper.find('.bg-red-500');
        console.warn("Speech button with aria-label not found, using class selector. Consider adding aria-label for better test robustness.");
      }
      expect(speechButton.exists()).toBe(true);

      await speechButton.trigger('click');

      // Assert that the SpeechRecognition constructor was called and started
      expect(mockSpeechRecognitionConstructor).toHaveBeenCalledTimes(1);
      expect(mockRecognitionInstance.start).toHaveBeenCalledTimes(1);
      // Assert recognizing state is true
      expect(wrapper.vm.recognizing).toBe(true);
      // Assert UI
      expect(wrapper.find('.bg-red-500').classes()).toContain('animate-pulse');
      expect(wrapper.text()).toContain('Listening...');
    });

    it('should process transcript from speech recognition result and update chat', async () => {
      const wrapper = mount(Chatbot);
      const speechButton = wrapper.find('.bg-red-500');

      await speechButton.trigger('click');
      expect(mockRecognitionInstance.start).toHaveBeenCalledTimes(1);

      const spokenText = "add task buy groceries";
      // Simulate the speech recognition returning a result
      mockRecognitionInstance._triggerResult(spokenText);

      // Add delay to ensure the mock fetch promise resolves before assertions
      await new Promise(resolve => setTimeout(resolve, 50));
      await nextTick();

      // Assert user message appears 
      expect(wrapper.findAll('.text-base').at(1)?.text()).toBe(spokenText);
      // Assert ai reply appears
      expect(wrapper.findAll('.text-base').at(2)?.text()).toBe('Mock AI response');

      // Assert states are reset afterwards
      expect(wrapper.vm.recognizing).toBe(false);
      expect(wrapper.find('.bg-red-500').classes()).not.toContain('animate-pulse');
      expect(wrapper.text()).toContain('Tap to Speak');
    });
  });

  // --- Edge Cases and Error Handling ---
  describe('STT Edge Cases and Error Handling', () => {
    it('should handle speech recognition errors gracefully', async () => {
      const wrapper = mount(Chatbot);
      const speechButton = wrapper.find('.bg-red-500');

      await speechButton.trigger('click');
      expect(mockRecognitionInstance.start).toHaveBeenCalledTimes(1);

      // Simulate an error event from the SpeechRecognition API
      mockRecognitionInstance._triggerError({ error: 'not-allowed', message: 'User denied microphone access' });

      await nextTick();

      // Assert that the recognizing state is reset
      expect(wrapper.vm.recognizing).toBe(false);
      expect(wrapper.find('.bg-red-500').classes()).not.toContain('animate-pulse');
      expect(wrapper.text()).toContain('Tap to Speak');
      
    });

    it('should reset recognizing state on speech recognition end event', async () => {
      const wrapper = mount(Chatbot);
      const speechButton = wrapper.find('.bg-red-500');

      await speechButton.trigger('click');
      expect(mockRecognitionInstance.start).toHaveBeenCalledTimes(1);

      mockRecognitionInstance._triggerEnd(); //end event

      await nextTick();

      // check reset recognizing state
      expect(wrapper.vm.recognizing).toBe(false);
      expect(wrapper.find('.bg-red-500').classes()).not.toContain('animate-pulse');
      expect(wrapper.text()).toContain('Tap to Speak');
    });

    it('should display alert if speech recognition is not supported', async () => {
      const originalSpeechRecognition = window.SpeechRecognition;
      const originalWebkitSpeechRecognition = window.webkitSpeechRecognition;

      Object.defineProperty(window, 'SpeechRecognition', { writable: true, value: undefined });
      Object.defineProperty(window, 'webkitSpeechRecognition', { writable: true, value: undefined });

      // Mock alert to capture its call
      const mockAlert = vi.fn();
      Object.defineProperty(window, 'alert', { writable: true, value: mockAlert });

      const wrapper = mount(Chatbot);
      const speechButton = wrapper.find('.bg-red-500');

      await speechButton.trigger('click');

      // Assert that the alert was called with the expected message
      expect(mockAlert).toHaveBeenCalledTimes(1);
      expect(mockAlert).toHaveBeenCalledWith('Speech recognition not supported in this browser. Please use Chrome or Edge.');
      //check not called
      expect(mockRecognitionInstance.start).not.toHaveBeenCalled();
      expect(wrapper.vm.recognizing).toBe(false);

      // Restore original properties after the test
      Object.defineProperty(window, 'SpeechRecognition', { writable: true, value: originalSpeechRecognition });
      Object.defineProperty(window, 'webkitSpeechRecognition', { writable: true, value: originalWebkitSpeechRecognition });
      Object.defineProperty(window, 'alert', { writable: true, value: vi.fn() }); // Reset mock alert 
    });
  });
});
