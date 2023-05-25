import React, { ReactElement, useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useRouter } from "next/router";

import { NextPageWithLayout } from "../../_app";

import axios from "axios";

import styles from "@/styles/AddEmployee.module.css";
import { Button, Header, Input } from "semantic-ui-react";

const Layout = dynamic(() => import("../../../components/layout"), { ssr: false });

const AddEmployeePage: NextPageWithLayout = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("123");
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState("");
  const router = useRouter();

  const addUser = () => {
    console.log("adding user", { email, password, name, file });
    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, { email, name, password, picture: url })
      .then((res) => {
        if (res.data) router.push("/dashboard");
      });
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      // Render image
      setFile(file);

      // Add image inside form data
      const formData = new FormData();
      formData.append("file", file);

      axios<{ url: string }>({
        method: "post",
        url: `${process.env.NEXT_PUBLIC_API_URL}/file/upload`,
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then((res) => {
        console.log("setting url to", res.data.url);
        setUrl(res.data.url);
      });
    } else {
      setFile(null);
    }
  };

  const isIncomplete = email !== "" && name !== "" && password !== "" && url !== "" && file !== null;

  return (
    <div className={styles.container}>
      <div className={styles["button-group"]}>
        <Header as="h1">
          <p>Add an employee to your office</p>
        </Header>

        <div className={styles["hor-container"]}>
          {file && <img width={200} height={200} src={URL.createObjectURL(file)} alt="profile" />}
          <Input type="file" onChange={(e) => uploadImage(e)} />
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <div className={styles["buttons-container"]}>
            <Button disabled={!isIncomplete} color="green" onClick={addUser}>
              Add Employee
            </Button>
            <Link href="/dashboard">
              <Button color="red">Cancel</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

AddEmployeePage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default AddEmployeePage;
