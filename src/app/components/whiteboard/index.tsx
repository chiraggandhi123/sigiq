import React, { useEffect, useState } from "react";
import { annotate } from "rough-notation";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import "./index.scss";
import { MockServerArgs } from "../../interface";
import { mockServer } from "../../utils";

interface Annotation {
  start: number;
  end: number;
  text: string;
}

const Whiteboard = () => {
  const [content, setContent] = useState<string>("");
  const [pattern, setPattern] = useState<RegExp | null>(null);
  const [inputText, setInputText] = useState<string>("");
  const handleWrite = async () => {
    const response = await mockServer("write");
    if (response?.mode === "WRITE") {
      const {text} = response?.payload;
      setContent("");
      animateWrite(text as string);
    }
  };
  const handleAppend = async () => {
    const response = await mockServer("append");
    if (response.mode === "APPEND") {
      animateWrite(response.payload.text as string);
    }
  };
  const handleAnnotate = async () => {
    const regex = new RegExp(`\\b${inputText}\\b`, "gi"); // This will match the dynamic value as a whole word
    setPattern(regex as RegExp);
  };
  const animateWrite = (text: string) => {
    let i = 0;
    const interval = setInterval(() => {
      setContent((prev) => prev + text[i]);
      i++;
      if (i >= text.length-1) clearInterval(interval);
    }, 50);
  };
  const renderAnnotatedContent = () => {
    let annotatedContent = content;
   if(pattern){
    annotatedContent = content.replace(pattern, (match) => {
        return `<span id="match">${match}</span>`;
      });
   }
    return annotatedContent;
  };
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.innerText);
  };

  useEffect(()=>{
    const elems: NodeListOf<HTMLElement> = document.querySelectorAll('span#match');
    elems.forEach((element) => {
        const annotation = annotate(element, { type: "underline", color: "red" });
        annotation.show();
    });
},[pattern]);

  return (
    <div className="whiteboard">
      
      <div className="content" id="content">
        <Markdown
        rehypePlugins={[rehypeRaw]}
        children={renderAnnotatedContent()}
        />
      </div>
      <div className="footer-input-btn">
      <div className="input-text" contentEditable suppressContentEditableWarning onInput={handleInputChange}>
        </div>
      <div className="buttons">
        <p className="write" onClick={handleWrite}>WRITE</p>
        <p className="append" onClick={handleAppend}>APPEND</p>
        <p className="annotate" onClick={handleAnnotate}>ANNOTATE</p>
      </div>
      </div>
    </div>
  );
};

export default Whiteboard;





