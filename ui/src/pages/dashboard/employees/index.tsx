import React, { ReactElement, useEffect, useState } from "react";

import type { NextPageWithLayout } from "../../_app";
import dynamic from "next/dynamic";
import { Button, Header, Icon, Label, Modal, Table } from "semantic-ui-react";

import { differenceInHours } from "date-fns";

import { TimeLog } from "../logs";
import Link from "next/link";
import router from "next/router";
import axios from "axios";

const Layout = dynamic(() => import("../../../components/layout"), { ssr: false });

export const revalidate = 1;

const EmployeesPage: NextPageWithLayout = () => {
  const [cell0Status, setCell0Status] = useState(false);
  const [cell1Status, setCell1Status] = useState(false);
  const [cell2Status, setCell2Status] = useState(false);
  const [open, setOpen] = useState(false);
  const [qrImage, setQrImage] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [cellId, setCellid] = useState(0);
  useEffect(() => {
    const getCellStatuses = () => {
      axios
        .get(`${process.env.NEXT_PUBLIC_API_URL}/api/Cell/GetCellStatuses`)
        .then((res) => {
          const { data } = res;
          console.log(data);
          if (data != null) {
            setCell0Status(data[0]);
            setCell1Status(data[1]);
            setCell2Status(data[2]);
          }
        })

        .catch((err) => {
          // TODO: Show error message
        });
    };

    if (router.query) {
      getCellStatuses();
    }
  }, [router.query]);
  const generateQrForCell = (id: number) => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/Cell/GetCells/cellId?cellId=${id}`)
      .then((res) => {
        const { data } = res;
        if (id == 0) {
          setCell0Status(true);
          setCellid(1);
        }
        if (id == 1) {
          setCell1Status(true);
          setCellid(2);
        }
        if (id == 2) {
          setCell2Status(true);
          setCellid(3);
        }
        console.log(data);
        setOpen(true);
        setQrImage(data.qrImage);
        setQrCode(data.qrCode);
        if (data != null) {
          console.log(data);
        } else {
          console.log(data);

          // TODO: Show error message
        }
      })
      .catch((err) => {
        console.log(err);
        // TODO: Show error message
      });
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      {cell0Status && (
        <Button color="red" onClick={() => console.log(cell0Status)}>
          Cell1
        </Button>
      )}
      {!cell0Status && (
        <Button color="green" onClick={(e) => generateQrForCell(0)}>
          Cell1
        </Button>
      )}

      {cell1Status && (
        <Button color="red" onClick={() => console.log(cell1Status)}>
          Cell2
        </Button>
      )}
      {!cell1Status && (
        <Button color="green" onClick={() => generateQrForCell(1)}>
          Cell2
        </Button>
      )}
      {cell2Status && (
        <Button color="red" onClick={() => console.log(cell2Status)}>
          Cell3
        </Button>
      )}
      {!cell2Status && (
        <Button color="green" onClick={() => generateQrForCell(2)}>
          Cell3
        </Button>
      )}
      <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}>
        <Modal.Content image>
          <Modal.Description>
            <Header as="h2">
              You successfully generated QR code for cell {cellId}
              <br></br>
              <label>{qrCode}</label>
            </Header>
            <img src={`data:image/jpeg;base64,${qrImage}`} />
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button content="Okay" labelPosition="right" icon="checkmark" onClick={() => setOpen(false)} positive />
        </Modal.Actions>
      </Modal>
    </div>
  );
};

EmployeesPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default EmployeesPage;
