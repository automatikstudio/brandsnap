import { ImageResponse } from "next/og";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 6,
          background: "linear-gradient(135deg, #C026D3 0%, #EAB308 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <span
          style={{
            color: "white",
            fontSize: 22,
            fontWeight: 700,
            fontFamily: "Arial, sans-serif",
            marginTop: -2,
          }}
        >
          B
        </span>
      </div>
    ),
    {
      ...size,
    }
  );
}
