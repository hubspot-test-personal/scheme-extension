import React, { useState } from "react";
import {
  TextArea,
  Tag,
  Tile,
  Box,
  Text,
  Flex,
  hubspot
} from "@hubspot/ui-extensions";

import { parse } from "sexpr-plus";

// Define the extension to be run within the Hubspot CRM
hubspot.extend(({ context, runServerlessFunction, actions }) => (
  <Extension
    context={context}
    runServerless={runServerlessFunction}
    sendAlert={actions.addAlert}
  />
));

// Define the Extension component, taking in runServerless, context, & sendAlert as props
const Extension = ({ context, runServerless, sendAlert }) => {
  const [userInput, setUserInputToParse] = useState("");

  // Call serverless function to execute with parameters.
  // The `myFunc` function name is configured inside `serverless.json`
  const handleClick = async () => {
    const { response } = await runServerless({ name: "myFunc", parameters: { text: text } });
    sendAlert({ message: response });
  };

  const handleInput = (input) => {
    setUserInputToParse(input);
  };

  const renderSexpr = (inputText) => {
    var parseResult;
    try {
      parseResult = parse(inputText);
      return (<Flex gap="small" align="start">{parseResult.map(renderSexprNode)}</Flex>);
    } catch (parseException) {
      console.error(parseException);
    }
  };

  const renderSexprNode = (node) => {
    const renderList = (list) => {

      const recursiveRender = list.content.map(renderSexprNode);
      return (
        <Flex gap="small" align="start">
          <Tile flex={1}>
          <Tag>list</Tag>
          <Flex gap="small" align="start">{recursiveRender}</Flex>
          </Tile>
        </Flex>);
    };

    const renderAtom = (atom) => {
      return (<Tile flex={1}><Tag>atom</Tag><Text>{atom.content}</Text></Tile>);
    };

    const renderString = (string) => {
      return (<Tile flex={1}><Tag>string</Tag><Text>{string.content}</Text></Tile>);
    };

    switch (node.type) {
      case "list":
        return renderList(node);
      case "atom":
        return renderAtom(node);
      case "string":
        return renderString(node);
    };
  };

  return (
    <>
      <TextArea label="Type your s-expr here"
        rows={20}
        onInput={handleInput} 
      />
      {renderSexpr(userInput)}
    </>
  );
};
