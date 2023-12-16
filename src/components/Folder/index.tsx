type FolderProps = {
  id: string;
  name: string;
  description: string;
};

export default function Folder({ folder }: { folder: FolderProps[] }) {
  return <div>Folder</div>;
}
