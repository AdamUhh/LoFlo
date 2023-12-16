import { Metadata } from "next";
import Container from "src/components/Container";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <Container>
      <p>Body</p>
    </Container>
  );
}
