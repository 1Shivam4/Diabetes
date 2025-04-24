import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { faFileContract, faUser } from "@fortawesome/free-solid-svg-icons";

const sidebarTabs = [
  {
    title: "Test",
    icon: faFileContract,
    route: "/user/test",
  },
  {
    title: "Profile",
    icon: faUser,
    route: "/user",
  },
];

export default function Sidebar() {
  return (
    <SidebarSection className="h-screen">
      <ul className="my-5 flex flex-col gap-5 justify-center items-center">
        {sidebarTabs.map((el) => (
          <li
            key={el.title}
            className="w-full text-center cursor-pointer p-3 hover:bg-gray-100 transition-colors"
          >
            <Link to={el.route}>
              <FontAwesomeIcon icon={el.icon} className="h-8 text-gray-700" />
              <p className="text-xs mt-1">{el.title}</p>
            </Link>
          </li>
        ))}
      </ul>
    </SidebarSection>
  );
}

const SidebarSection = styled.section`
  width: 80px;
  height: 100vh;
  position: fixed;
  border-right: 1px solid #e0e0e0;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;
