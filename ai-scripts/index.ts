import fs from 'fs';
import OpenAI from 'openai';
import { zodResponseFormat } from 'openai/helpers/zod';
import path from 'path';
import { z } from 'zod';

const content_schema = z.object({
    topic: z.string(),
    // content: z.string(),
    questions: z.array(
        z.object({
            text: z.string(),
            explanation: z.string(),
            options: z.array(
                z.object({
                    text: z.string(),
                    isCorrect: z.boolean(),
                })
            ),
        })
    ),
});

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function generate(topic: string, msg: string): Promise<string> {
    /*`Create educational content for a cognitive assessment preparation module on the topic of "${topic}". Write a concept explanation (500 words) that introduces the topic, explains its significance in cognitive assessments, and provides examples or scenarios where relevant. Additionally, generate 40 multiple-choice questions (MCQs) at a challenging 4th-grade level with detailed explanations and options, ensuring the questions are difficult and the response follows the specified schema.` */
    const response = await openai.chat.completions.create({
        messages: [
            {
                role: 'user',
                content: `Create educational content for a cognitive assessment preparation module on the topic of "${topic}". Write a concept explanation (500 words) that introduces the topic, explains its significance in cognitive assessments, and provides examples or scenarios where relevant. Additionally, generate 40 multiple-choice questions (MCQs) at a challenging 4th-grade level with detailed explanations and options, ensuring the questions are difficult and the response follows the specified schema.`,
            },
            {
                role: 'assistant',
                content: msg,
            },
            {
                role: 'user',
                content: `Create educational content for a cognitive assessment preparation module on the topic of "${topic}".Generate Additionally 40 multiple-choice questions (MCQs) at a challenging 4th-grade level with detailed explanations and options, ensuring the questions are difficult and the response follows the specified schema.`,
            },
        ],
        model: 'gpt-4o-mini',
        response_format: zodResponseFormat(
            content_schema,
            'content_generation'
        ),
    });
    console.log(response.choices[0].message.content?.substring(0, 100));

    return response.choices[0].message.content ?? '';
}

const topics = [
    { id: '1arithmetic', name: 'Arithmetic' },
    { id: '2figure_weights', name: 'Figure Weights' },
    { id: '3matrix_reasoning', name: 'Matrix Reasoning' },
    {
        id: '4matrix_reasoning___analogies',
        name: 'Matrix Reasoning - Analogies',
    },
    { id: '5pattern_matrix_reasoning', name: 'Pattern Matrix Reasoning' },
    { id: '6picture_concepts', name: 'Picture Concepts' },
    { id: '7learning', name: 'Learning' },
    {
        id: '8rapid_naming__literacy_and_quantity_',
        name: 'Rapid Naming (Literacy and Quantity)',
    },
    { id: '10coding', name: 'Coding' },
    { id: '12comprehension', name: 'Comprehension' },
    { id: '13information', name: 'Information' },
    { id: '14similarities', name: 'Similarities' },
    { id: '15vocabulary', name: 'Vocabulary' },
    { id: '16pattern_tile_forms', name: 'Pattern Tile Forms' },
    { id: '17block_design___easy', name: 'Block Design - Easy' },
    { id: '18block_design___hard', name: 'Block Design - Hard' },
    { id: '19visual_puzzles', name: 'Visual Puzzles' },
    { id: '20vocabulary', name: 'Vocabulary' },
    { id: '21vocabulary_bonus', name: 'Vocabulary Bonus' },
    { id: '22word_reasoning', name: 'Word Reasoning' },
    { id: '23digit_span', name: 'Digit Span' },
    { id: '24letter_number_sequencing', name: 'Letter-Number Sequencing' },
    { id: '25picture_span', name: 'Picture Span' },
    { id: '26Serial_Order_Matrices', name: 'Serial Order Matrices' },
    { id: '27Rapid_Naming', name: 'Learning and Memory Subtest - Rapid Naming-Literacy and Quantity' },
    { id: '28Rapid_Naming', name: 'Learning and Memory Subtest - Symbol Translation Immediate and Delayed' },
    { id: '29Cancellation', name: 'Processing Speed Subtest - Cancellation' },
    { id: '30Symbol_Search', name: 'Processing Speed Subtest - Symbol Search' },
];

// Function to check if a directory exists
function directoryExists(directory: string): boolean {
    return fs.existsSync(directory);
}

// Function to create a directory if it doesn't exist
function createDirectory(directory: string): void {
    if (!directoryExists(directory)) {
        fs.mkdirSync(directory, { recursive: true });
    }
}

// Function to save content to a JSON file
function saveContentToFile(
    directory: string,
    topicId: string,
    content: any
): void {
    const filePath = path.join(directory, `${topicId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(content, null, 2));
}
// Function to count the number of directories in a given path
function countDirectories(basePath: string): number {
    return fs
        .readdirSync(basePath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory()).length;
}

// Main function to generate content and save it
async function generateAndSaveContent(filerTopics: string[]) {
    const baseDir = './content';
    const count = countDirectories(baseDir);
    const targetDir = path.join(baseDir, `generation${count + 1}`);
    createDirectory(targetDir);
    const filteredTopics = topics.filter(topic =>
        filerTopics.includes(topic.id)
    );

    for (const topic of filteredTopics) {
        const existingFilePath = path.join('../content', `${topic.id}.json`);
        let existingContent = { topic: topic.name, questions: [] };

        if (fs.existsSync(existingFilePath)) {
            const fileData = fs.readFileSync(existingFilePath, 'utf-8');
            existingContent = JSON.parse(fileData);
        }

        const newContent = await generate(
            topic.name,
            JSON.stringify(existingContent)
        );
        const newQuestions = JSON.parse(newContent).questions;

        existingContent.questions =
            existingContent.questions.concat(newQuestions);

        saveContentToFile(targetDir, topic.id, existingContent);
        saveContentToFile(path.join('../content'), topic.id, existingContent);
    }
}

// Call the main function
generateAndSaveContent([
    //'1arithmetic',
    // '2figure_weights',
    // '3matrix_reasoning',
    // '4matrix_reasoning___analogies',
    // '5pattern_matrix_reasoning',
    // '6picture_concepts',
    // '7learning',
    // '8rapid_naming__literacy_and_quantity_',
    // '10coding',
    // '12comprehension',
    // '13information',
    // '14similarities',
    // '15vocabulary',
    // '16pattern_tile_forms',
    // '17block_design___easy',
    // '18block_design___hard',
    // '19visual_puzzles',
    // '20vocabulary',
    // '21vocabulary_bonus',
    // '22word_reasoning',
    // '23digit_span',
    // '24letter_number_sequencing',
    // '25picture_span',
    // '26Serial_Order_Matrices',
    // '27Rapid_Naming',
    // '28Rapid_Naming',
     '29Cancellation',
    // '30Symbol_Search'
]).catch(console.error);
