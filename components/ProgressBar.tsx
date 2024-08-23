// components/ProgressBar.tsx
const ProgressBar = ({ progress }: { progress: number }) => {
    return (
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className="bg-blue-500 dark:bg-blue-300 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>
    );
  };
  
  export default ProgressBar;
  