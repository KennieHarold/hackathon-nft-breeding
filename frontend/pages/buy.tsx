import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import Header from "../components/Header";
import Tab from "../components/Tab";

const Buy: NextPage = () => {
  return (
    <div className={styles.container} style={{ marginBottom: "5em" }}>
      <Header />
      <Tab selected={"buy"} />
    </div>
  );
};

export default Buy;
