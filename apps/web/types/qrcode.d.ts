declare module "qrcode" {
  type DataUrlOptions = {
    margin?: number;
    width?: number;
  };

  export function toDataURL(
    text: string,
    options?: DataUrlOptions,
  ): Promise<string>;
}
