import { useEffect } from "react";
import { useSearchParams } from "react-router";

export default function Room() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const name = searchParams.get("name");
    console.log(name);
  }, [searchParams]);

  return <div>Room</div>;
}
