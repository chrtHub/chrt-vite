interface Chat {
  date: string;
  uuid: string;
  description: string;
  promptCount: number;
  sizeKB: number;
}

interface ChatHistory {
  [date: string]: Chat[];
}

export const data: ChatHistory = {
  "2023-03-20": [
    {
      date: "2023-03-20",
      uuid: "abc123",
      description: "First entry for March 20th",
      promptCount: 2,
      sizeKB: 32,
    },
    {
      date: "2023-03-20",
      uuid: "def456",
      description: "Second entry for March 20th",
      promptCount: 3,
      sizeKB: 48,
    },
  ],
  "2023-03-19": [
    {
      date: "2023-03-19",
      uuid: "ghi789",
      description: "Entry for March 19th",
      promptCount: 1,
      sizeKB: 16,
    },
  ],
  "2023-03-18": [
    {
      date: "2023-03-18",
      uuid: "jkl012",
      description: "First entry for March 18th",
      promptCount: 4,
      sizeKB: 64,
    },
    {
      date: "2023-03-18",
      uuid: "mno345",
      description: "Second entry for March 18th",
      promptCount: 2,
      sizeKB: 32,
    },
  ],
  "2023-03-17": [
    {
      date: "2023-03-17",
      uuid: "pqr678",
      description: "Entry for March 17th",
      promptCount: 2,
      sizeKB: 32,
    },
  ],
};
