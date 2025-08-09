import request from 'supertest'
import express from 'express'
import claudeRouter from '../../routes/claude'
import { spawn } from 'child_process';



const app = express()
app.use(express.json())
app.use('/claude', claudeRouter)



const test_cases = [
    {
        "category": "General Caregiving",
        "prompt": "what do you do?",
        "reference_answer": `I'm Leo the Lion, a virtual assistant specifically designed to support caregivers like you who are using the IM-OKToo webapp. I was created by Lions Befrienders here in Singapore to help make your caregiving journey a little easier.
Here's what I do for caregivers:
I provide practical advice and information about:

Elderly care topics like managing dementia, diabetes, heart conditions, and other health issues
Safety concerns like fall prevention and emergency procedures
Legal and financial matters such as power of attorney and insurance questions
Local Singapore resources including healthcare services, support groups, and government programs

I help you navigate the IM-OKToo app by:

Guiding you through features like scheduling and appointment booking
Helping with task management
Pointing you toward useful forum discussions
Explaining how to use the resource directory

I also share information about:

Government grants available to caregivers and seniors in Singapore (like the Home Caregiving Grant and Caregivers Training Grant)
Training programs offered by Lions Befrienders that can help you develop better caregiving skills while taking care of your own wellbeing
Local support services and resources

Most importantly, I try to provide emotional support and encouragement. Caregiving can be incredibly challenging, and I'm here to listen, validate your feelings, and help you find the resources and support you need.
Is there something specific about caregiving that you'd like help with today?`
    },
    {
        "category": "Practical Advice", 
        "prompt": "What over-the-counter medicine can I give for my mother's joint pain?",
        "reference_answer":` I understand you want to help your mother with her joint pain, but I cannot recommend specific over-the-counter medications without knowing her full medical history, current medications, and other health conditions.
Here's what I strongly suggest:
First, consult with a healthcare professional before giving any medication. This could be:

Her regular doctor or GP
A pharmacist who can review her current medications for interactions
A polyclinic doctor if she doesn't have a regular GP

This is especially important for elderly individuals because:

They may have kidney, liver, or heart conditions that affect medication safety
Many common pain relievers can interact with other medications
Dosing may need to be adjusted for age and weight

What you CAN do safely while waiting to speak with a healthcare provider:

Apply gentle heat or cold packs to the affected joints (whatever feels more comfortable to her)
Encourage gentle movement within her comfort level
Ensure she's getting adequate rest
Consider gentle massage if she finds it soothing

For ongoing joint pain management, Singapore has many resources including physiotherapy services available through polyclinics, and some may be covered under government schemes.
If her pain becomes severe or she develops signs of infection (redness, swelling, warmth), please seek medical attention promptly.
Would you like information about accessing healthcare services in Singapore or other non-medication approaches to managing joint pain?`
    }
]
    ;
interface EvaluationResult {
  average_f1: number;
  average_sbert: number;
  results: {
    Category: string;
    Prompt: string;
    'Reference Answer': string;
    'Chatbot Response': string;
    Precision: number;
    Recall: number;
    'F1 Score': number;
    'SBERT Similarity': number;
  }[];
}
async function getResponses() {
  const responses: string[] = [];
    // Loop through each test case and send the prompt to the Claude API

  for (const tc of test_cases) {
    const res = await request(app)
      .post('/claude')
      .send({ message: tc.prompt });
      console.log('API response body:', res.body);

    // Handle different statuses gracefully if needed
    if (res.status === 200 && res.body.reply) {
      responses.push(res.body.reply);
    }
  }
  return responses;
}

async function runEvaluation(responses: string[]): Promise<EvaluationResult> {
  const input = test_cases.map((tc, i) => ({
    category: tc.category,
    prompt: tc.prompt,
    reference_answer: tc.reference_answer,  // keep naming consistent
    chatbot_response: responses[i]
  }));

  return new Promise((resolve, reject) => {
    const py = spawn('python', ['backend/src/tests/bert_eval.py']);

    // Write JSON input to Python stdin
    py.stdin.write(JSON.stringify(input));
    py.stdin.end();

    let stdoutData = '';
    let stderrData = '';

    py.stdout.on('data', (data) => {
      stdoutData += data.toString();
    });

    py.stderr.on('data', (err) => {
      stderrData += err.toString();
    });

    py.on('close', (code) => {
      if (code !== 0) {
        console.error('Python process exited with code', code);
        console.error('stderr:', stderrData);
        return reject(new Error(`Python process exited with code ${code}`));
      }

      try {
        // The Python script prints ONLY JSON at the end,
        // so parse the entire stdout as JSON
        const output = JSON.parse(stdoutData);
        resolve(output);
      } catch (e) {
        console.error('Failed to parse JSON output:', e);
        console.error('Raw stdout:', stdoutData);
        reject(e);
      }
    });
  });
}

describe('Claude API integration with evaluation', () => {
  it('should get responses and evaluate with Python script', async () => {
    const responses = await getResponses()
    expect(responses.length).toBe(test_cases.length) // basic sanity check

    const evaluationResult = await runEvaluation(responses)
    expect(evaluationResult).toHaveProperty('average_f1')
    expect(evaluationResult).toHaveProperty('results')
    expect(Array.isArray(evaluationResult.results)).toBe(true)
    expect(evaluationResult.results.length).toBe(test_cases.length)

    for (const res of evaluationResult.results) {
      console.log(`${res.Prompt}: SBERT similarity = ${res['SBERT Similarity']}`)
      expect(typeof res['SBERT Similarity']).toBe('number')
    }
  }, 120000) // increase timeout if needed for API calls
})