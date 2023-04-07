//-- POST a message to continue a conversation --//
//-- Uses "next" action --//

let foo = {
  action: "next",
  messages: [
    {
      id: "d1ffd99b-3085-4fa6-ac6f-f9426f879c06",
      author: {
        role: "user",
      },
      content: {
        content_type: "text",
        parts: [
          "strategies for synchronizing a file in a react app between the client and the server, where the server is storing the file in AWS EFS",
        ],
      },
    },
  ],
  parent_message_id: "32e8b602-39a8-4e17-bba5-b3c667e6f447",
  model: "text-davinci-002-browse",
  timezone_offset_min: 300,
};

// has conversation id
let baz = {
  action: "next",
  messages: [
    {
      id: "3585e0d1-88ec-4bac-b9ed-297f1c42648f",
      author: {
        role: "user",
      },
      content: {
        content_type: "text",
        parts: ["say more"],
      },
    },
  ],
  conversation_id: "36f36ea5-c311-4b91-a30b-6e9a5c8b336d",
  parent_message_id: "fb26781a-322f-40ff-a53c-fe6979527ba2",
  model: "text-davinci-002-browse",
  timezone_offset_min: 300,
};

let test1 = {
  action: "next",
  messages: [
    {
      id: "240f4cbe-2c6e-455c-b60a-47f91b2a787f",
      author: {
        role: "user",
      },
      content: {
        content_type: "text",
        parts: ["what is the meaning of life?"],
      },
    },
  ],
  conversation_id: "36f36ea5-c311-4b91-a30b-6e9a5c8b336d",
  parent_message_id: "bd8742ee-7904-4605-9c62-719e41ba3409",
  model: "text-davinci-002-browse",
  timezone_offset_min: 300,
};

// new chat
let new1 = {
  action: "next",
  messages: [
    {
      id: "448de6e3-a180-4dac-a182-d9cab5f3deeb",
      author: {
        role: "user",
      },
      content: {
        content_type: "text",
        parts: ["testing new caht"],
      },
    },
  ],
  parent_message_id: "ccb6c967-0cb7-42b3-b66e-7c3e59632eb8",
  model: "text-davinci-002-browse",
  timezone_offset_min: 300,
};

// 2nd message
let new2 = {
  action: "next",
  messages: [
    {
      id: "d82efb9c-d430-4e4a-a33e-23894847fc00",
      author: {
        role: "user",
      },
      content: {
        content_type: "text",
        parts: ["and the second message"],
      },
    },
  ],
  conversation_id: "57df801b-c586-44a5-9b0c-a9b3737bf3b9",
  parent_message_id: "a65e3799-cd12-4ddd-9691-341172fa6754",
  model: "text-davinci-002-browse",
  timezone_offset_min: 300,
};
