import { Spinner } from "@chakra-ui/react";
const Loading = () => {
  return (
    <Spinner
      color="red.500"
      animationDuration="0.8s"
      css={{ "--spinner-track-color": "colors.teal.500" }}
    />
  );
};
export default Loading;
