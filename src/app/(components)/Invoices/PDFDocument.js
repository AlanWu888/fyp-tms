import React from "react";
import {
  Document,
  Page,
  View,
  StyleSheet,
  PDFViewer,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

const PDFDocument = ({ children }) => (
  <PDFViewer>
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>{children}</View>
      </Page>
    </Document>
  </PDFViewer>
);

export default PDFDocument;
