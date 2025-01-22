import { useEffect, useState } from "react";
import { themes } from "../themes";

const Index = () => {
  const [origin, setOrigin] = useState<string>(".");
  const [unionname, setUnionname] = useState<string>(Object.keys(themes)[0]);
  const [username, setUsername] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [url, setURL] = useState<string>("");

  const handleChangeUnionname = (e) => {
    setUnionname(e.target.value);
  };
  const handleChangeUsername = (e) => {
    setUsername(e.target.value);
  };
  const handleChangeDesc = (e) => {
    setDesc(e.target.value);
  };
  const handleChangeURL = (e) => {
    setURL(e.target.value);
  };
  const handleCopyClipBoard = async () => {
    try {
      await navigator.clipboard.writeText(imageUrl);
      alert("클립보드에 링크가 복사되었습니다.");
    } catch (e) {
      alert("복사에 실패하였습니다");
    }
  };
  const handleCopyMarkdownClipBoard = async () => {
    const markdownURL = `![${
      unionname.charAt(0).toUpperCase() + unionname.slice(1)
    } Badge](${imageUrl})`;

    try {
      await navigator.clipboard.writeText(markdownURL);
      alert("클립보드에 링크가 복사되었습니다.");
    } catch (e) {
      alert("복사에 실패하였습니다");
    }
  };

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  const imageUrl = `${origin}/api/v1${
    unionname.length ? `?unionname=${unionname}` : ""
  }${username.length ? `&username=${username}` : ""}${
    desc.length ? `&desc=${desc}` : ""
  }${url.length ? `&url=${url}` : ""}`.replace(/\ /g, "%20");

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <img
        src={imageUrl}
        style={{ height: "640px", padding: "32px 100%", background: "gray" }}
      />

      <div
        style={{
          padding: "12px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div>{imageUrl}</div>
        <div style={{ display: "flex", gap: "4px" }}>
          <button onClick={handleCopyClipBoard}>Copy URL</button>
          <button onClick={handleCopyMarkdownClipBoard}>Copy Markdown</button>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "end",
          gap: "8px",
        }}
      >
        <label style={{ display: "flex", gap: "4px" }}>
          <div>Union:</div>
          <select
            value={unionname}
            name="union"
            id="lang"
            style={{ width: "178px" }}
            onChange={handleChangeUnionname}
          >
            {Object.entries(themes).map(([key, value]) => (
              <option key={key} value={key}>
                {value.title}
              </option>
            ))}
          </select>
        </label>
        <label style={{ display: "flex", gap: "4px" }}>
          <div>Username:</div>
          <input type="text" value={username} onChange={handleChangeUsername} />
        </label>
        <label style={{ display: "flex", gap: "4px" }}>
          <div>description:</div>
          <input type="text" value={desc} onChange={handleChangeDesc} />
        </label>
        <label style={{ display: "flex", gap: "4px" }}>
          <div>URL:</div>
          <input type="text" value={url} onChange={handleChangeURL} />
        </label>
      </div>
    </div>
  );
};

export default Index;
