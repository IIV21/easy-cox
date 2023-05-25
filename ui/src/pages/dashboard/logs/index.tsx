import React, { ReactElement, useEffect, useState } from "react";

import type { NextPageWithLayout } from "../../_app";
import dynamic from "next/dynamic";
import { Table } from "semantic-ui-react";
import { format } from "date-fns";

import { Employee } from "../employees";
import Link from "next/link";

const Layout = dynamic(() => import("../../../components/layout"), { ssr: false });

export interface TimeLog {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string;
  UserId: number;
  Type: "entrance" | "exit";
}

export const revalidate = 1;

const LogsPage: NextPageWithLayout = () => {
  const [logs, setLogs] = useState<TimeLog[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      let token = "";
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token") || "";
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees/logs`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 1 },
      });

      const resJson = await res.json();

      const fetchedLogs = resJson.timeLogs as TimeLog[] | undefined;

      if (fetchedLogs) setLogs(fetchedLogs);
    };

    const fetchEmployees = async () => {
      let token = "";
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token") || "";
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 1 },
      });

      const resJson = await res.json();

      const fetchedEmployees = resJson.employees as Employee[] | undefined;

      if (fetchedEmployees) setEmployees(fetchedEmployees);
    };

    fetchLogs();
    fetchEmployees();
  }, []);

  function getEmployeeWithId(id: number) {
    return employees.find((e) => e.ID === id);
  }

  return (
    <div style={{ marginLeft: "20px", marginRight: "20px" }}>
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="5">Logs</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {logs.map((l, key) => (
            <Table.Row key={key}>
              <Table.Cell>
                <Link href={`/employees/${l.UserId}`}>{getEmployeeWithId(l.UserId)?.name || "None"}</Link>
              </Table.Cell>
              <Table.Cell>{format(new Date(l.CreatedAt), "eee, h:mm a (d MMM)")}</Table.Cell>
              <Table.Cell>{l.Type}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  );
};

LogsPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default LogsPage;
