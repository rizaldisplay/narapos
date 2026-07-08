import { useZxing } from "react-zxing";

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
}

export default function BarcodeScanner({
  onScan,
}: BarcodeScannerProps) {
  const { ref } = useZxing({
    onDecodeResult(result) {
      onScan(result.rawValue ?? "");
    },
  });

  return (
    <video
      ref={ref}
      className="w-full h-full object-cover rounded-xl"
    />
  );
}