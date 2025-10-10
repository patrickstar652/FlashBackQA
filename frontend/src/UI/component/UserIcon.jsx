import { Avatar, AvatarGroup } from "@chakra-ui/react";
import React from "react";

const UserIcon = () => {
  return (
    <>
      <AvatarGroup>
        <Avatar.Root shape="rounded" variant="solid" size="lg"> 
          <Avatar.Fallback name="ai logo"/>
          <Avatar.Image src="https://cdn-icons-png.flaticon.com/512/6537/6537392.png" />
        </Avatar.Root>
      </AvatarGroup>
    </>
  );
};
export default UserIcon;
