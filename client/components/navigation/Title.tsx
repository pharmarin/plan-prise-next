import ClientTitle from "components/navigation/ClientTitle";

const Title: React.FC<{ title: string }> = ({ title }) => {
  return <ClientTitle title={title} />;
};

export default Title;
