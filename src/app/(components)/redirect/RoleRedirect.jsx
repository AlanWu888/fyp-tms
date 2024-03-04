"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from "./RoleRedirect.module.css";
import { useEffect } from "react";

const RoleRedirect = () => {
  const router = useRouter();

  const { data: session } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/");
    },
  });

  // redirect user based on user role
  useEffect(() => {
    let role = session?.user?.role;
    if (role == "admin") {
      router.push("/admin");
    }
    if (role == "user") {
      router.push("/user/time");
    }
    if (role == "manager") {
      router.push("/manager/time");
    }
  }, [router, session?.user?.role]);

  return (
    <div className={styles.container}>
      <img src="/bast-logo.svg" />
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}></div>
      </div>
      <p className="text">Redirecting</p>
    </div>
  );
};

export default RoleRedirect;
