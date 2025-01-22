import QRCode from "qrcode.react";

import useSWR from "swr";
// import PersonComponent from "../components/Person";
import type { Person } from "../interfaces";
import { useEffect, useState } from "react";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Index() {
  const { data, error, isLoading } = useSWR<Person[]>("/api/people", fetcher);
  const [img, setImg] = useState<string>();

  const imageUrl = "https://i.imgur.com/fHyEMsl.jpg";

  const fetchImage = async () => {
    const res = await fetch(imageUrl);
    const imageBlob = await res.blob();
    const imageObjectURL = URL.createObjectURL(imageBlob);
    console.log(imageObjectURL);
    setImg(imageObjectURL);
  };

  useEffect(() => {
    fetchImage();
  }, []);

  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;
  if (!data) return null;

  return (
    // <QRCode value= {'https://github.com/Jadest13/Jadest13'} />
    // <ul>
    //   {data.map((p) => (
    //     <PersonComponent key={p.id} person={p} />
    //   ))}
    // </ul>
    <img height={200} src={img}></img>
  );
}
