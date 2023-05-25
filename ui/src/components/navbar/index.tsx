import React from "react";
import { useRouter } from "next/router";

import { Menu } from "semantic-ui-react";

export default function Navbar() {
  const router = useRouter();

  return (
    <Menu>
      <Menu.Item
        name="employees"
        onClick={() => {
          router.push("/dashboard/employees");
        }}
      >
        Employees
      </Menu.Item>

      <Menu.Item
        name="add-employee"
        onClick={() => {
          router.push("/dashboard/add-employee");
        }}
      >
        Add New Employee
      </Menu.Item>

      <Menu.Item
        name="logs"
        onClick={() => {
          router.push("/dashboard/logs");
        }}
      >
        Logs
      </Menu.Item>
    </Menu>
  );
}
