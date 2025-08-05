import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import EventForm from '../EventForm.vue' // Adjust path accordingly
import { nextTick } from 'vue'

describe('EventForm.vue full integration test', () => {
  let fetchMock: any

  beforeEach(() => {
    global.localStorage = {
      getItem: vi.fn((key) => {
        if (key === 'username') return 'testuser'
        if (key === 'email') return 'test@example.com'
        return null
      }),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    }

    fetchMock = vi.fn().mockResolvedValue({
      ok: true,
    })
    global.fetch = fetchMock
  })

  it('fills all fields and submits the form successfully', async () => {
    const wrapper = mount(EventForm, {
      global: {
        // Register child components normally if needed
        // or stub components if focusing on form-level functionality
      },
    })

    // Fill EventTitle (input)
    const titleInput = wrapper.find('input[name="title"]')
    await titleInput.setValue('Test Event')

    // Select EventCategory
    await wrapper.find('[data-testid="category-trigger"]').trigger('click')
    await nextTick()
    const categoryOption = wrapper.findAll('li').find(li => li.text().includes('Appointments'))
    if (categoryOption) await categoryOption.trigger('click')

    // Select EventElderly
    await wrapper.find('[data-testid="elderly-trigger"]').trigger('click')
    await nextTick()
    const elderlyOption = wrapper.findAll('li').find(li => li.text().includes('Sally'))
    if (elderlyOption) await elderlyOption.trigger('click')

    await wrapper.find('[data-testid="start-trigger-calendar"]').trigger('click')
    await nextTick()
    const startCalendar = wrapper.find('[data-testid="start-calendar"]')
    expect(startCalendar.exists()).toBe(true)
    // Only then, if it's a real Vue component:
    if (startCalendar.vm) {
    await startCalendar.vm.$emit('update:modelValue', new Date())
    }
    await nextTick()

    // 2. Find startTime select and choose a time (e.g., "10:00")
    const startTimeSelect = wrapper.findAllComponents({ name: 'Select' })[0]  // Adjust index as needed
    await startTimeSelect.find('button').trigger('click')  // open dropdown
    await nextTick()

    // Select the option "10:00" (find by text)
    const startTimeOption = startTimeSelect.findAll('li').find(li => li.text().trim() === '10:00')
    if (startTimeOption) {
    await startTimeOption.trigger('click')
    await nextTick()
    }

    // 3. Find endDate Calendar component and emit update with a date 1 hour later
    const endCalendar = wrapper.findAllComponents({ name: 'Calendar' })[1]  // Adjust index accordingly
    const endDate = new Date(today.getTime() + 60 * 60 * 1000)  // 1 hour later (still same day)
    await endCalendar.vm.$emit('update:modelValue', endDate)
    await nextTick()

    // 4. Find endTime select and choose "11:00"
    const endTimeSelect = wrapper.findAllComponents({ name: 'Select' })[1]  // Adjust index
    await endTimeSelect.find('button').trigger('click')
    await nextTick()

    const endTimeOption = endTimeSelect.findAll('li').find(li => li.text().trim() === '11:00')
    if (endTimeOption) {
    await endTimeOption.trigger('click')
    await nextTick()
    }


    // Fill EventGuest (textarea input)
    const guestsInput = wrapper.find('input[name="guests"]')
    await guestsInput.setValue('guest1@example.com, guest2@example.com')

    // Fill EventLocation (input)
    const locationInput = wrapper.find('input[name="location"]')
    await locationInput.setValue('123 Event Location')

    // Fill EventDescription (textarea)
    const descriptionTextarea = wrapper.find('textarea[name="description"]')
    await descriptionTextarea.setValue('This is a test event description.')

    // Select EventRecurrence
    await wrapper.find('button:contains("Does not repeat")').trigger('click')
    await nextTick()
    const recurrenceOption = wrapper.findAll('li').find(li => li.text().includes('Weekly on this day'))
    if (recurrenceOption) await recurrenceOption.trigger('click')

    // Submit the form
    await wrapper.find('form').trigger('submit.prevent')
    await nextTick()

    // Assert fetch was called to submit form
    expect(fetchMock).toHaveBeenCalled()

    // Check fetch payload
    const payload = JSON.parse(fetchMock.mock.calls[0][1].body)
    expect(payload.title).toBe('Test Event')
    expect(payload.category).toBe('Appointments')
    expect(payload.elderly).toBe('Sally')
    expect(payload.guests).toBe('guest1@example.com, guest2@example.com')
    expect(payload.location).toBe('123 Event Location')
    expect(payload.description).toBe('This is a test event description.')
    expect(payload.recurrence).toBe('FREQ=WEEKLY')
  })

  it('shows validation errors on empty submit', async () => {
    const wrapper = mount(EventForm)

    await wrapper.find('form').trigger('submit.prevent')
    await nextTick()

    // Validate error messages appear for required fields
    expect(wrapper.text()).toContain('Start date cannot be in the past')
    // Add more error checks relevant to your form schema
  })
})
