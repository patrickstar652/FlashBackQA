import { Avatar, AvatarGroup } from "@chakra-ui/react";
import React from "react";

const UserIcon = () => {
  return (
    <>
      <AvatarGroup>
        <Avatar.Root shape="rounded" variant="solid" size="lg"> 
          <Avatar.Fallback name="ai logo"/>
          <Avatar.Image src="https://thumbs.dreamstime.com/b/artificial-intelligence-icon-ai-three-stars-logo-application-website-flat-vector-illustration-eps-371594668.jpg" />
        </Avatar.Root>
      </AvatarGroup>
    </>
  );
};
export default UserIcon;
