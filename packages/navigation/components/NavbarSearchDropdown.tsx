import { useState } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDownIcon } from "@heroicons/react/solid";
import Link from "next/link";
import SuggestedCreatorCard from "@packages/feed/components/SuggestedCreatorCard";

import {
  DropdownContent,
  NavDropdownContainer,
  NavDropdownItem,
} from "./DropdownContainer";
import {
  BoldLink,
  ImportantText,
  Text,
  MutedText,
} from "@packages/shared/components/Typography/Text";
import { Container } from "@packages/shared/components/Container";

const ExploreDropdownLinks = [
  {
    fname: "Elvin Kakomo",
    uname: "codeslayer",
  },
  {
    fname: "Tatenda Chinyamakobvu",
    uname: "kamfacekaya",
  },
  {
    fname: "Wallace Mukoka",
    uname: "mrfresh",
  },
  {
    fname: "Dylan Chigwanda",
    uname: "chigwanda",
  },
  {
    fname: "Munya Makosa",
    uname: "munyawerasta",
  },
  {
    fname: "Arvid Kakomo",
    uname: "spragga",
  },
];

const NavbarSearchDropdown = () => {
  const [searchText, setSearchText] = useState("");

  return (
    <div>
      <div className="max-w-md w-full items-center hidden md:flex">
        <input
          className="max-w-md w-full py-2 px-8 rounded-full border"
          placeholder="Search content"
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>
      {searchText !== "" ? (
        <Container
          css={{
            backgroundColor: "$elementSurface",
            borderRadius: "16px",
            position: "absolute",
          }}
          className="max-w-md w-full grid gap-4 grid-cols-1 p-4 shadow mt-2"
        >
          <Container>
            <Text>
              <MutedText>Search Results</MutedText>
            </Text>
            <div>
              {ExploreDropdownLinks.filter((item) => {
                const keyword = searchText.toLocaleLowerCase();
                const fullname = item.fname.toLocaleLowerCase();
                const username = item.uname.toLocaleLowerCase();

                return fullname.includes(keyword) || username.includes(keyword);
              }).map((item, i) => (
                <SuggestedCreatorCard
                  key={i}
                  username={item.uname}
                  display_name={item.fname}
                  avatar=""
                  bio="Mystery SEV. Suddenly, the site goes dark. The dashboard is red. Everything seems fucked. There's no indication why."
                  isPromoted
                />
              ))}
            </div>
          </Container>
        </Container>
      ) : null}
    </div>
  );
};

export default NavbarSearchDropdown;
