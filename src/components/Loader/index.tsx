import BeatLoader from "react-spinners/BeatLoader";

type Props = {
  loading: boolean;
};

export default function Loader(props: Props) {
  const { loading } = props;

  return <BeatLoader color="#EB5531" loading={loading} />;
}
