import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

import axios from "axios";

import { Button, Header, Input } from "semantic-ui-react";

import styles from "@/styles/Login.module.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const login = (e: React.ChangeEvent) => {
    e.preventDefault();

    if (email === "root" || password === "toor") {
      router.push("/dashboard");

    }
    axios.post<{ token: string }>(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, { email, password }).then((res) => {
      localStorage.setItem("token", res.data.token);
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles["button-group"]}>
        <Header as="h1">
          <p>Log in to Admin Portal</p>
        </Header>
        <form className={styles["hor-container"]}>
          <Input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <div className={styles["buttons-container"]}>
            <Button type="submit" color="green" onClick={(e) => login(e)}>
              Log In
            </Button>
            <Link href="/">
              <Button type="button" color="red">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
