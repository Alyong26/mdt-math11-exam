import type { Question } from "@/types";

export const EXAM_TITLE = "2026 DIVISION DIAGNOSTIC TEST – Grade 11 Mathematics";
export const TOTAL_QUESTIONS = 40;
export const PASSING_PERCENTAGE = 60;

export const questions: Question[] = [
  {
    number: 1,
    question:
      "Maria earns an annual salary of ₱360,000. What is her approximate weekly wage?",
    options: {
      A: "₱6,000",
      B: "₱6,923",
      C: "₱7,500",
      D: "₱30,000",
    },
    answer: "B",
  },
  {
    number: 2,
    question:
      "A jacket's price increased from ₱1,200 to ₱1,500. What is the percentage increase?",
    options: {
      A: "20%",
      B: "25%",
      C: "30%",
      D: "35%",
    },
    answer: "B",
  },
  {
    number: 3,
    question:
      "A store buys a bag for ₱400 and sells it at a 35% markup. What is the selling price?",
    options: {
      A: "₱540",
      B: "₱500",
      C: "₱560",
      D: "₱600",
    },
    answer: "A",
  },
  {
    number: 4,
    question: "What is the next term in the sequence: 2, 5, 8, 11, __?",
    options: {
      A: "12",
      B: "13",
      C: "14",
      D: "15",
    },
    answer: "C",
  },
  {
    number: 5,
    question:
      "Find the sum of the first 10 terms of the arithmetic sequence: 5, 9, 13, 17, …",
    options: {
      A: "230",
      B: "250",
      C: "270",
      D: "290",
    },
    answer: "A",
  },
  {
    number: 6,
    question:
      "A loan is repaid with equal monthly payments of ₱5,000 for 3 years. Which concept is best used to compute the total amount paid?",
    options: {
      A: "Simple interest",
      B: "Compound interest",
      C: "Arithmetic series",
      D: "Geometric series",
    },
    answer: "C",
  },
  {
    number: 7,
    question:
      "Which metric unit is most appropriate for measuring the mass of a grain of rice?",
    options: {
      A: "Kilogram",
      B: "Gram",
      C: "Milligram",
      D: "Tonne",
    },
    answer: "C",
  },
  {
    number: 8,
    question:
      "A cylindrical water tank has a radius of 2 m and a height of 5 m. What is its volume? (Use π ≈ 3.14)",
    options: {
      A: "62.8 m³",
      B: "31.4 m³",
      C: "125.6 m³",
      D: "157 m³",
    },
    answer: "A",
  },
  {
    number: 9,
    question:
      "If 1 US dollar = ₱55.50, how many pesos can you get for 200 US dollars?",
    options: {
      A: "₱1,000",
      B: "₱2,775",
      C: "₱11,100",
      D: "₱55,500",
    },
    answer: "C",
  },
  {
    number: 10,
    question: "Convert 25°C to Fahrenheit using °F = (°C × 9/5) + 32.",
    options: {
      A: "45°F",
      B: "68°F",
      C: "77°F",
      D: "85°F",
    },
    answer: "C",
  },
  {
    number: 11,
    question: "Which function is classified as quadratic?",
    options: {
      A: "f(x) = 2x + 3",
      B: "f(x) = |x|",
      C: "f(x) = √x",
      D: "f(x) = x² – 4x + 1",
    },
    answer: "D",
  },
  {
    number: 12,
    question: "What is the shape of the graph of f(x) = |x|?",
    options: {
      A: "Parabola",
      B: "V-shape",
      C: "Straight line",
      D: "Half-line (square root shape)",
    },
    answer: "B",
  },
  {
    number: 13,
    question:
      "A worker earns ₱200 per hour for the first 40 hours and ₱300 per hour for overtime. If he works 45 hours, what is his gross pay?",
    options: {
      A: "₱9,500",
      B: "₱8,000",
      C: "₱9,000",
      D: "₱10,000",
    },
    answer: "A",
  },
  {
    number: 14,
    question:
      "A taxi fare is ₱40 for the first kilometer and ₱12 for each additional kilometer. Which piecewise function correctly represents the fare F(d) for distance d (in km)?",
    options: {
      A: "F(d) = 40 + 12d",
      B: "F(d) = 40d + 12",
      C: "F(d) = { 40, if d ≤ 1; 40 + 12(d–1), if d > 1}",
      D: "F(d) = { 40, if d = 1; 12d, if d > 1}",
    },
    answer: "C",
  },
  {
    number: 15,
    question: "What type of data is the number of students in a classroom?",
    options: {
      A: "Categorical",
      B: "Discrete quantitative",
      C: "Continuous quantitative",
      D: "Ordinal",
    },
    answer: "B",
  },
  {
    number: 16,
    question:
      "For the data set: 12, 15, 12, 16, 18, 19, which measure of central tendency is most appropriate (no extreme outliers)?",
    options: {
      A: "Mean",
      B: "Median",
      C: "Mode",
      D: "Range",
    },
    answer: "A",
  },
  {
    number: 17,
    question:
      "In a right triangle with angle θ, the opposite side is 3 and the adjacent side is 4. What is tan θ?",
    options: {
      A: "3/4",
      B: "4/3",
      C: "3/5",
      D: "4/5",
    },
    answer: "A",
  },
  {
    number: 18,
    question:
      "A triangle has sides 5 cm, 6 cm, and 7 cm. Which formula is best to find its area?",
    options: {
      A: "½ × base × height",
      B: "½ ab sin C",
      C: "Heron's formula",
      D: "Pythagorean theorem",
    },
    answer: "C",
  },
  {
    number: 19,
    question:
      "A 10-meter ladder leans against a wall, making an angle of 60° with the ground. How high up the wall does the ladder reach? (sin 60° ≈ 0.866)",
    options: {
      A: "5 m",
      B: "8.66 m",
      C: "10 m",
      D: "17.32 m",
    },
    answer: "B",
  },
  {
    number: 20,
    question:
      "A ship sails 50 km east, then 30 km north. What is the bearing of the ship from its starting point?",
    options: {
      A: "059°",
      B: "030°",
      C: "090°",
      D: "120°",
    },
    answer: "A",
  },
  {
    number: 21,
    question: "A rectangular garden is 8 m long and 5 m wide. What is its perimeter?",
    options: {
      A: "26 m",
      B: "13 m",
      C: "40 m",
      D: "80 m",
    },
    answer: "A",
  },
  {
    number: 22,
    question:
      "A water tank has a capacity of 2,500 liters. How many cubic meters is that? (1 m³ = 1,000 L)",
    options: {
      A: "2.5 m³",
      B: "0.25 m³",
      C: "25 m³",
      D: "250 m³",
    },
    answer: "A",
  },
  {
    number: 23,
    question: "Which of the following is a continuous random variable?",
    options: {
      A: "Number of students present",
      B: "Number of cars in a parking lot",
      C: "Height of a person",
      D: "Number of phone calls received",
    },
    answer: "C",
  },
  {
    number: 24,
    question:
      "A discrete random variable X has the distribution: P(1)=0.2, P(2)=0.5, P(3)=0.3. What is the expected value of X?",
    options: {
      A: "2.1",
      B: "1.8",
      C: "2.0",
      D: "2.3",
    },
    answer: "A",
  },
  {
    number: 25,
    question: "Which property is true for a normal distribution?",
    options: {
      A: "It is skewed to the right.",
      B: "The mean, median, and mode are all equal.",
      C: "It has two peaks.",
      D: "The standard deviation is always zero.",
    },
    answer: "B",
  },
  {
    number: 26,
    question: "A z-score of –1.5 means the raw score is:",
    options: {
      A: "1.5 standard deviations above the mean",
      B: "1.5 standard deviations below the mean",
      C: "1.5 times the mean",
      D: "1.5 less than the mean",
    },
    answer: "B",
  },
  {
    number: 27,
    question:
      "In a standard normal distribution, approximately what is the probability that Z is between –1 and 1?",
    options: {
      A: "0.34",
      B: "0.68",
      C: "0.95",
      D: "0.997",
    },
    answer: "B",
  },
  {
    number: 28,
    question:
      "Which sampling method involves dividing the population into subgroups and then randomly selecting from each subgroup?",
    options: {
      A: "Simple random",
      B: "Systematic",
      C: "Stratified",
      D: "Cluster",
    },
    answer: "C",
  },
  {
    number: 29,
    question:
      "₱10,000 is invested at 5% compounded annually for 3 years. What is the maturity value?",
    options: {
      A: "₱11,576.25",
      B: "₱10,500",
      C: "₱11,000",
      D: "₱12,000",
    },
    answer: "A",
  },
  {
    number: 30,
    question:
      "An annuity where payments are made at the end of each period is called:",
    options: {
      A: "Ordinary annuity",
      B: "Annuity due",
      C: "Deferred annuity",
      D: "General annuity",
    },
    answer: "A",
  },
  {
    number: 31,
    question: "A business loan is typically used for:",
    options: {
      A: "Expanding a business",
      B: "Buying a personal car",
      C: "Paying for a family vacation",
      D: "Purchasing household appliances",
    },
    answer: "A",
  },
  {
    number: 32,
    question:
      "A null hypothesis (H₀) states that a new drug has no effect. A Type I error occurs when:",
    options: {
      A: "We reject a true null hypothesis",
      B: "We fail to reject a false null hypothesis",
      C: "We accept a true alternative hypothesis",
      D: "The p-value is zero",
    },
    answer: "A",
  },
  {
    number: 33,
    question:
      "Which statistical test is appropriate for comparing the means of two independent groups when the population standard deviation is unknown?",
    options: {
      A: "Independent samples t-test",
      B: "z-test for known variance",
      C: "One-sample t-test",
      D: "Paired t-test",
    },
    answer: "A",
  },
  {
    number: 34,
    question:
      "A scatter plot shows points tightly clustered around a line that slopes downward. The correlation is:",
    options: {
      A: "Strong positive",
      B: "Strong negative",
      C: "Weak positive",
      D: "Zero",
    },
    answer: "B",
  },
  {
    number: 35,
    question: "Which of the following is a logical proposition?",
    options: {
      A: '"5 is an odd number."',
      B: '"Close the door."',
      C: '"What time is it?"',
      D: '"x + 5"',
    },
    answer: "A",
  },
  {
    number: 36,
    question: "Which of the following is a compound proposition?",
    options: {
      A: "p",
      B: '"It is raining."',
      C: "p ∧ q",
      D: "True",
    },
    answer: "C",
  },
  {
    number: 37,
    question:
      'The conditional statement "If it rains, then the ground is wet" is logically equivalent to:',
    options: {
      A: "If the ground is not wet, then it did not rain.",
      B: "If the ground is wet, then it rained.",
      C: "If it does not rain, then the ground is not wet.",
      D: "It rains if and only if the ground is wet.",
    },
    answer: "A",
  },
  {
    number: 38,
    question:
      "A statement that is always true, regardless of the truth values of its components, is called a:",
    options: {
      A: "Contradiction",
      B: "Tautology",
      C: "Fallacy",
      D: "Contingency",
    },
    answer: "B",
  },
  {
    number: 39,
    question: "A logical fallacy is:",
    options: {
      A: "An error in reasoning that makes an argument invalid",
      B: "A valid argument form",
      C: "A statement that is always false",
      D: "A proposition that cannot be determined true or false",
    },
    answer: "A",
  },
  {
    number: 40,
    question:
      'In the proposition "If x > 2, then x² > 4", what is the truth value when x = 3?',
    options: {
      A: "True",
      B: "False",
      C: "Undetermined",
      D: "Both true and false",
    },
    answer: "A",
  },
];

export function getQuestionByNumber(num: number): Question | undefined {
  return questions.find((q) => q.number === num);
}

export function calculateScore(
  answers: Record<number, string>
): { score: number; total: number; percentage: number } {
  let score = 0;
  for (const q of questions) {
    if (answers[q.number] === q.answer) score++;
  }
  const total = questions.length;
  const percentage = Math.round((score / total) * 100 * 100) / 100;
  return { score, total, percentage };
}
