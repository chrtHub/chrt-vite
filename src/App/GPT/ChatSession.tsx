//-- react, react-router-dom, recoil, Auth0 --//
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { useAuth0 } from "@auth0/auth0-react";

//-- TSX Components --//

//-- NPM Components --//

//-- Icons --//

//-- NPM Functions --//
import axios from "axios";

//-- Utility Functions --//
import classNames from "../../Util/classNames";

//-- Environment Variables, TypeScript Interfaces, Data Objects --//
import { fooState } from "./atoms";
let VITE_ALB_BASE_URL: string | undefined = import.meta.env.VITE_ALB_BASE_URL;

//-- Types --//

//-- ***** ***** ***** Exported Component ***** ***** ***** --//
export default function ChatSession() {
  //-- React State --//
  const [fooLoading, setFooLoading] = useState<boolean>(false);

  //-- Recoil State --//
  const [bar, setBar] = useRecoilState(fooState);

  //-- Auth --//
  const { getAccessTokenSilently } = useAuth0();

  //-- Other [] --//

  //-- Side Effects --//

  //-- Click Handlers --//

  const items = [
    {
      id: 1,
      prompt: "What's your favorite book?",
      response:
        "I'm an AI language model, so I don't have the ability to read books like humans do. However, I can generate text based on various prompts and contexts, including book-related topics. Would you like me to generate a text based on a book-related prompt?",
    },
    {
      id: 2,
      prompt: "What do you think of the latest developments in AI research?",
      response:
        "As an AI language model, I'm programmed to generate text based on various topics, including AI research. However, I don't have personal opinions or feelings like humans do. If you have a specific AI-related topic or question, I can try to generate a text based on that.",
    },
    {
      id: 3,
      prompt: "Can you tell me a joke?",
      response:
        "Sure, here's a joke for you: Why did the tomato turn red? Because it saw the salad dressing! I can generate many more jokes if you'd like.",
    },
  ];

  //-- ***** ***** ***** Component Return ***** ***** ***** --//
  return (
    <div className="flex justify-center">
      <ul role="list" className="divide-y divide-zinc-200">
        {items.map((item) => (
          <article className="prose prose-zinc">
            <li key={item.id}>
              <h2>{item.prompt}</h2>
              <p>{item.response}</p>
            </li>
          </article>
        ))}
      </ul>
    </div>
  );
}
