export default interface Columns {
  id:
    | ""
    | "id"
    | "description"
    | "type"
    | "created"
    | "days"
    | "blocked"
    | "file1"
    | "file2"
    | "file3"
    | "file4"
    | "file5"
    | "user"
    | "expiration_date";
  label: string;
  minWidth?: number;
  align?: "left" | "right";
  component?: any;
  download?: boolean;
  shortText?: boolean;
}
