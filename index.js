const topics = [
  { id: "1arithmetic", name: "Arithmetic" },
  { id: "2figure_weights", name: "Figure Weights" },
  { id: "3matrix_reasoning", name: "Matrix Reasoning" },
  {
    id: "4matrix_reasoning___analogies",
    name: "Matrix Reasoning - Analogies",
  },
  { id: "5pattern_matrix_reasoning", name: "Pattern Matrix Reasoning" },
  { id: "6picture_concepts", name: "Picture Concepts" },
  { id: "7learning", name: "Learning" },
  {
    id: "8rapid_naming__literacy_and_quantity_",
    name: "Rapid Naming (Literacy and Quantity)",
  },
  { id: "10coding", name: "Coding" },
  { id: "12comprehension", name: "Comprehension" },
  { id: "13information", name: "Information" },
  { id: "14similarities", name: "Similarities" },
  { id: "15vocabulary", name: "Vocabulary" },
  { id: "16pattern_tile_forms", name: "Pattern Tile Forms" },
  { id: "17block_design___easy", name: "Block Design - Easy" },
  { id: "18block_design___hard", name: "Block Design - Hard" },
  { id: "19visual_puzzles", name: "Visual Puzzles" },
  { id: "20vocabulary", name: "Vocabulary" },
  { id: "21vocabulary_bonus", name: "Vocabulary Bonus" },
  { id: "22word_reasoning", name: "Word Reasoning" },
  { id: "23digit_span", name: "Digit Span" },
  { id: "24letter_number_sequencing", name: "Letter-Number Sequencing" },
  { id: "25picture_span", name: "Picture Span" },
];

const topicList = document.getElementById("topicList");
const topicContent = document.getElementById("topicContent");
const mcqArea = document.getElementById("mcqArea");

function createTopicList() {
  topics.forEach((topic) => {
    const topicElement = document.createElement("button");
    topicElement.className =
      "w-full text-left px-4 py-2 mb-2 bg-white hover:bg-gray-200 focus:bg-gray-200 rounded-md shadow-sm transition duration-150 ease-in-out";
    topicElement.textContent = topic.name;
    topicElement.addEventListener("click", () => loadTopic(topic.id));
    topicList.appendChild(topicElement);
  });
}

async function loadTopic(topicId) {
  try {
    const response = await fetch(
      `https://amitsharma-consultant.github.io/cognitive_prep_as/content/${topicId}.json`
    );
    const data = await response.json();
    displayContent(data.content);
    displayMCQs(data.questions);
  } catch (error) {
    console.error("Error loading topic:", error);
    topicContent.innerHTML =
      '<p class="text-red-500">Error loading topic content.</p>';
    mcqArea.innerHTML = "";
  }
}

function displayContent(content) {
  topicContent.innerHTML = marked.parse(content);
}

function displayMCQs(questions) {
  if (!questions || questions.length === 0) {
    mcqArea.innerHTML =
      '<p class="text-gray-600 italic">No MCQs available for this topic.</p>';
    return;
  }

  let mcqHtml =
    '<h2 class="text-2xl font-bold mt-8 mb-4 text-gray-800">Multiple Choice Questions</h2>';
  questions.forEach((question, index) => {
    mcqHtml += `
            <div class="mb-6 p-4 bg-gray-50 rounded-lg">
                <p class="font-semibold text-lg mb-2">${index + 1}. ${
      question.text
    }</p>
                <div class="ml-4 space-y-2">
                    ${question.options
                      .map(
                        (option) => `
                        <div class="flex items-start">
                            <span class="inline-flex items-center justify-center w-6 h-6 mr-2 ${
                              option.isCorrect
                                ? "bg-green-500 text-white"
                                : "bg-gray-200 text-gray-600"
                            } rounded-full flex-shrink-0">
                                ${option.isCorrect ? "✓" : ""}
                            </span>
                            <span class="${
                              option.isCorrect ? "font-semibold" : ""
                            }">${option.text}</span>
                        </div>
                    `
                      )
                      .join("")}
                </div>
                ${
                  question.explanation
                    ? `
                    <div class="mt-3 p-3 bg-blue-50 rounded">
                        <p class="text-sm text-blue-800"><strong>Explanation:</strong> ${question.explanation}</p>
                    </div>
                `
                    : ""
                }
            </div>
        `;
  });
  mcqArea.innerHTML = mcqHtml;
}

createTopicList();
