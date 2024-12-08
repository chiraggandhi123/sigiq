import React, { useEffect, useRef, useState } from "react";
import { annotate } from "rough-notation";
import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import "./index.scss";
import { mockServer } from "../../utils";



const Whiteboard = () => {
  const [content, setContent] = useState<string>("");
  const [animatedText, setAnimatedText] = useState<string>("");
  const [inputText, setInputText] = useState<string>("");
  const [annotations, setAnnotations] = useState<any>([]);
  const animatedIdx = useRef(0);
  const [shouldRenderAnimation, setShoudlRenderAnimation] = useState(false);
  const handleWrite = async () => {
    setContent("");
    setAnimatedText("");
    setShoudlRenderAnimation(true);
    animatedIdx.current = 0;
    const response = await mockServer("write");
    if (response?.mode === "WRITE") {
      const {text} = response?.payload;
      setContent(text as string);
    }
  };

  const handleAnnotate = async () => {
    // debugger;
    setShoudlRenderAnimation(false);
    const [regexInp, index] = inputText.split('#');
    const regex = new RegExp(`\\b${regexInp}\\b`, "gi"); 
    setAnnotations((prev:any)=>[...prev,{
      idx:index, regex:regex
    }])
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.innerText);
  };
  const renderAnnotatedContent = () => {
    let annotatedContent = content;
  
    annotations.forEach((item: any, id: any) => {
      annotatedContent = annotatedContent.replace(item.regex, (match) => {
        return `<span id="match-${id}">${match}</span>`;
      });
    });
  
    return annotatedContent;
  };
  
  const handleAppend = async () => {
    setShoudlRenderAnimation(true); 
    const response = await mockServer("append");
  
    if (response.mode === "APPEND") {
      const newContent = response.payload.text;
  
      setContent((prev) => prev + newContent);
  
      setAnnotations((prev:any) => [...prev]); 
    }
  };
  
  useEffect(() => {
    if (annotations.length > 0) {
      const annotatedContent = renderAnnotatedContent();
      setAnimatedText(annotatedContent); }
  }, [content, annotations]);
  
  useEffect(()=>{
    if(annotations.length > 0){
      console.log(annotations);
      for(let  i =0;i<annotations.length;i++){
        const elems: NodeListOf<HTMLElement> = document.querySelectorAll(`span#match-${i}`);
        if(elems.length > 0 && annotations[i].idx < elems.length){
          const annotation = annotate(elems[annotations[i].idx], { type: "underline", color: "red" });
          annotation.show();
        }
      }
    }
},[annotations]);


useEffect(() => {
  const text = content;
  const interval = setInterval(() => {
    if (animatedIdx.current < text.length - 1) {
      setAnimatedText((prev) => prev + text[animatedIdx.current]);
      animatedIdx.current++;
    } else {
      clearInterval(interval);
    }
  }, 50); 

  return () => clearInterval(interval); // Cleanup
}, [content]);
  return (
    <div className="whiteboard">
      
      <div className="content" id="content">
        <Markdown
        rehypePlugins={[rehypeRaw]}
        children={shouldRenderAnimation ? animatedText : renderAnnotatedContent()}
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





