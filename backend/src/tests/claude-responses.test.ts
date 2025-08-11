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
    },
    {
  category: "Task Management",
  prompt: "Please add a reminder to buy groceries tomorrow.",
  reference_answer: `{"action": "add_task", "task": "buy groceries tomorrow"}`
},
 {category: "Emotional Support",
  prompt: "What can I do to stay hopeful and positive during difficult times caregiving?",
  reference_answer: `Maintaining hope and positivity during the toughest caregiving moments is one of the greatest challenges you'll face, and it's completely normal to struggle with this. Your awareness of needing hope shows incredible strength.
Here are some ways to nurture hope and find light during dark times:
Focus on Small Moments:

Celebrate tiny victories - a good day, a smile from your loved one, a moment of connection
Keep a gratitude journal, even if it's just noting one small thing each day
Look for moments of joy or humor, however brief they may be
Take photos or notes of peaceful or happy moments to revisit later

Reframe Your Perspective:

Remember that providing love and care is one of the most meaningful things a person can do
Focus on the present moment rather than worrying about the future
Recognize that difficult days don't last, but your love and dedication do
View challenges as opportunities to grow stronger and more compassionate

Build Your Support Network:

Connect with other caregivers who can remind you that you're not alone
Share your struggles honestly with trusted friends or family
Consider joining caregiver support groups where hope and encouragement are shared
Don't isolate yourself when things get tough

Spiritual and Personal Growth:

Engage in activities that feed your soul - music, nature, reading, prayer, meditation
Remember your "why" - the love and commitment that drives your caregiving
Allow yourself to grieve losses while still holding space for hope
Consider counseling or support services when hope feels too hard to find alone

Lions Befrienders offers training specifically on managing grief and loss in caregiving, which can help you process difficult emotions while maintaining hope.`},

{
  category: "Health Management",
  prompt: "My dad has diabetes. How can I help him manage it better?",
  reference_answer: `Managing diabetes well is absolutely crucial for your dad's health and quality of life, and having family support like yours makes such a difference. Here are key areas where you can help:
Blood Sugar Monitoring:

Help establish a routine for checking blood glucose levels as recommended by his doctor
Keep a log of his readings, noting patterns and what might affect them
Learn to recognize signs of high blood sugar (frequent urination, excessive thirst, fatigue) and low blood sugar (shakiness, sweating, confusion)
Ensure he always has his glucose meter and supplies easily accessible

Diet and Nutrition:

Work with a dietitian to create meal plans that keep blood sugar stable
Focus on consistent meal timing rather than skipping meals
Learn about carbohydrate counting and portion control
Keep healthy snacks available for low blood sugar episodes
Encourage plenty of water and limit sugary drinks

Medication Management:

Help him take medications exactly as prescribed and at consistent times
Use pill organizers or medication reminder systems
Never skip or double doses without consulting his doctor
Keep an updated list of all his medications

Physical Activity:

Encourage regular, gentle exercise as approved by his doctor
Even short walks after meals can help with blood sugar control
Monitor his feet daily for cuts or sores that might not heal well

Emergency Preparedness:

Keep glucose tablets or fast-acting sugar sources readily available
Know when to seek immediate medical help
Ensure he wears medical identification

Regular Healthcare:

Help him keep all medical appointments
Ensure regular eye exams, foot checks, and kidney function tests

In Singapore, polyclinics offer diabetes management programs, and there may be subsidies available through various government health schemes.
Would you like specific information about diabetes support services available locally?`}
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
  it('should get responses from Claude API', async () => {
    const responses = await getResponses()
    expect(responses.length).toBe(test_cases.length)
    
    responses.forEach((response, index) => {
      expect(response).toBeDefined()
      expect(typeof response).toBe('string')
      expect(response.length).toBeGreaterThan(0)
      console.log(`Test case ${index + 1} (${test_cases[index].category}): Response received (${response.length} chars)`)
    })
    
    const generalResponse = responses[0]                         // "what do you do?" response
    const lowerResponse = generalResponse.toLowerCase()
    expect(
      lowerResponse.includes('leo') || 
      lowerResponse.includes('caregiver') || 
      lowerResponse.includes('assist')
    ).toBe(true)
    
    console.log('All Claude API responses received successfully')
  }, 60000)
  it.skip('should evaluate responses with Python BERT (currently disabled)', async () => {

    const responses = await getResponses()
    const evaluationResult = await runEvaluation(responses)
    expect(evaluationResult).toHaveProperty('average_f1')
  })
})