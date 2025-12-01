// Simple reusable Inverted Index implementation for Questions
// Key: word (lowercased)
// Value: Set of questionIds (as strings)

class InvertedIndex {
  constructor() {
    this.index = new Map();
  }

  clear() {
    this.index.clear();
  }

  /**
   * Tokenize a piece of text into normalized words
   * @param {string} text
   * @returns {string[]}
   */
  tokenize(text) {
    if (!text || typeof text !== "string") return [];
    const matches = text.toLowerCase().match(/\b\w+\b/g);
    return matches || [];
  }

  /**
   * Add a question document to the index
   * @param {object} question
   */
  addDocument(question) {
    if (!question || !question._id) return;

    const id = question._id.toString();

    const words = new Set();

    // Index title and description
    this.tokenize(question.question).forEach((w) => words.add(w));
    this.tokenize(question.description).forEach((w) => words.add(w));

    // Index tags
    if (Array.isArray(question.tags)) {
      question.tags.forEach((tag) => {
        this.tokenize(tag).forEach((w) => words.add(w));
      });
    }

    words.forEach((word) => {
      if (!this.index.has(word)) {
        this.index.set(word, new Set());
      }
      this.index.get(word).add(id);
    });
  }

  /**
   * Remove a question from the index by id
   * @param {string} id
   */
  removeById(id) {
    if (!id) return;
    const idStr = id.toString();
    this.index.forEach((set) => {
      if (set.has(idStr)) {
        set.delete(idStr);
      }
    });
  }

  /**
   * Search the index for a query string.
   * Performs AND intersection across words.
   * @param {string} query
   * @returns {string[]} array of matching questionIds
   */
  search(query) {
    const terms = this.tokenize(query);
    if (!terms.length) return [];

    let resultSet = null;

    for (const term of terms) {
      const ids = this.index.get(term);
      if (!ids) {
        // If any term is missing, intersection is empty
        return [];
      }

      if (resultSet === null) {
        // First term
        resultSet = new Set(ids);
      } else {
        // Intersect with existing resultSet
        const nextSet = new Set();
        ids.forEach((id) => {
          if (resultSet.has(id)) {
            nextSet.add(id);
          }
        });
        resultSet = nextSet;
      }

      // Early exit if intersection becomes empty
      if (!resultSet.size) {
        return [];
      }
    }

    return Array.from(resultSet);
  }
}

export const invertedIndex = new InvertedIndex();

/**
 * Build the index from all existing questions in the database.
 * @param {import("../../model/question.js").default} QuestionModel
 */
export const buildIndexFromQuestions = async (QuestionModel) => {
  const questions = await QuestionModel.find(
    {},
    "_id question description tags"
  ).lean();

  invertedIndex.clear();

  questions.forEach((q) => invertedIndex.addDocument(q));
};

/**
 * Convenience helper to index a single Question document
 */
export const indexQuestionInverted = (question) => {
  invertedIndex.addDocument(question);
};

/**
 * Convenience helper to remove a Question from the index by id
 */
export const removeQuestionFromIndex = (id) => {
  invertedIndex.removeById(id);
};


