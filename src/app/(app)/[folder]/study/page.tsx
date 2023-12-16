import { Metadata } from "next";
import Container from "src/components/Container";

export const metadata: Metadata = {
  title: "Start Learning",
};

export default function StudyModePage() {
  return (
    <Container>
      <p>Study Mode Page</p>
    </Container>
  );
}
