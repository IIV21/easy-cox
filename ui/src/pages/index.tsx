import styles from "@/styles/Home.module.css";
import bg from "../../public/background.jpeg";

import Link from "next/link";
import { useState } from "react";

import { Button, Header, Modal, Image, Label, Input } from "semantic-ui-react";
import axios from "axios";

const checkedInModalHeader = "Welcome to the office";
const checkedInHeader = "You have checked in";
const checkedInDescription = () =>
  "The time of your check in is: " +
  new Date().toLocaleTimeString() +
  " " +
  new Date().toLocaleDateString() +
  ".\nGood luck with your work!";

const checkedOutModalHeader = "See you tomorrow";
const checkedOutHeader = "You have checked out";
const checkedOutDescription = () =>
  "The time of your check out is: " +
  new Date().toLocaleTimeString() +
  " " +
  new Date().toLocaleDateString() +
  ".\nEnjoy the rest of your day!";

export default function Home() {
  const [open, setOpen] = useState(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [qrData, setQrData] = useState("");
  const [qrCodeValue, setQrCodeValue] = useState("");
  const [cellId, setCellId] = useState(-1);
  const [closeCell, setCloseCell] = useState(false);
  const [error, setError] = useState(false);

  const checkIn = () => {
    setCheckingIn(true);

    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/Cell/OpenCellByQrCodeScan`)
      .then((res) => {
        const { data } = res;
        console.log(data);
        if (data != null) {
          setQrCodeValue(data.qrCodeValue);
          setCellId(data.cellId);
          setOpen(true);
          setCheckingIn(false);
        } else {
          setCheckingIn(false);
          // TODO: Show error message
        }
      })
      .catch((err) => {
        setCheckingIn(false);
        // TODO: Show error message
      });
  };

  const openCellByCode = (code: string) => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/Cell/OpenCellByCode/code?code=${code}`)
      .then((res) => {
        const { data } = res;
        console.log(data);
        setQrData(data.qrImage);
        if (data != null) {
          console.log(data);
          setCheckingIn(true);
          setQrCodeValue(data.qrCodeValue);
          setCellId(data.cellId);
          setOpen(true);
          setCheckingIn(false);
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
  const closeCellById = (id: number) => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/api/Cell/CloseCellById/cellId?cellId=${id}`)
      .then((res) => {
        const { data } = res;
        console.log(data);
        if (data != null) {
          setCloseCell(true);
        } else {
          console.log(data);
          console.log("ffs");

          // TODO: Show error message
        }
      })
      .catch((err) => {
        console.log("asd");
        console.log(err);
        setOpen(true);
        // TODO: Show error message
      });
  };

  return (
    <div className={styles.container} style={{ backgroundImage: `url(${bg.src})`, backgroundSize: "cover" }}>
      <div className={styles["button-group"]}>
        <Header as="h1">
          <p style={{ color: "black" }}>Emag EasyCox</p>
        </Header>
        <Button loading={checkingIn} onClick={checkIn} color="green">
          Scan QR Code
        </Button>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <label style={{ fontSize: "20px", color: "black", fontWeight: "bold" }}>QrCode</label>
          <Input onChange={(e) => setQrCode(e.target.value)}></Input>
        </div>
        <Button color="green" onClick={() => openCellByCode(qrCode)}>
          Enter
        </Button>

        <Link href="/login">
          <Button color="red">Go to log in</Button>
        </Link>
      </div>

      <Modal onClose={() => setOpen(false)} onOpen={() => setOpen(true)} open={open}>
        <Modal.Content image>
          <Modal.Description>
            <Header as="h2">
              {!error && (
                <p>
                  Hello, you opened the cell {cellId + 1} with code {qrCodeValue}
                </p>
              )}
              {error && <p>Hello, you entered the wrong cell code</p>}
            </Header>
            <Button onClick={() => closeCellById(cellId)}>Close Cell</Button>
            {closeCell ? "The cell is now locked" : null}{" "}
          </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
          <Button content="Okay" labelPosition="right" icon="checkmark" onClick={() => setOpen(false)} positive />
        </Modal.Actions>
      </Modal>
    </div>
  );
}
