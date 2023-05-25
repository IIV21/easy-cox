import React, { ReactElement, useEffect, useState } from "react";

import type { NextPageWithLayout } from "../_app";
import dynamic from "next/dynamic";
import { Table } from "semantic-ui-react";
import { format } from "date-fns";

import { Employee } from "../dashboard/employees";
import Link from "next/link";
import { useRouter } from "next/router";

const Layout = dynamic(() => import("../../components/layout"), { ssr: false });

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
  const [employee, setEmployee] = useState<Employee | undefined>(undefined);

  const router = useRouter();

  useEffect(() => {
    const fetchLogs = async () => {
      let token = "";
      if (typeof window !== "undefined") {
        token = localStorage.getItem("token") || "";
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees/logs/${router.query.id}`, {
        headers: { Authorization: `Bearer ${token}` },
        next: { revalidate: 1 },
      });

      const resJson = await res.json();

      const fetchedLogs = resJson.logs as TimeLog[] | undefined;

      console.log("Setting logs to", fetchedLogs);
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

      console.log(fetchedEmployees?.find((e) => e.ID === parseInt(router.query.id as string)));

      if (fetchedEmployees) setEmployee(fetchedEmployees.find((e) => e.ID === parseInt(router.query.id as string)));
    };

    if (router.query.id) {
      fetchLogs();
      fetchEmployees();
    }
  }, [router.query]);

  return (
    <div style={{ marginLeft: "20px", marginRight: "20px" }}>
      <div style={{ display: "flex", gap: "30px", width: "100%", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "row", gap: "30px" }}>
          <img src={employee?.picture} alt="picture" width={200} height={200} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h1>Name: {employee?.name}</h1>
            <h1>Email: {employee?.email}</h1>
            <h1>Joined {format(new Date((employee?.CreatedAt as string) || 0), "dd MMM yyyy")}</h1>
          </div>
        </div>
        <img src={employee?.qrCodeUrl} alt="qrCode" width={200} height={200} />
      </div>
      <Table celled striped>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="5">Logs</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {logs.map((l, key) => (
            <Table.Row key={key}>
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
