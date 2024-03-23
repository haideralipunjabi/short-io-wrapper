"use client";
import { FormEvent, useState } from "react";

export default function Home() {
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(undefined);
    setSuccess(undefined);
    const formData = new FormData(e.target as HTMLFormElement);
    const response = await fetch("/", {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    if (data["error"]) {
      setError(data["error"]);
    } else {
      setSuccess(data["shortURL"]);
    }
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl">
        <i>haider.id</i> URL Shortner
      </h1>
      <form
        onSubmit={onSubmit}
        className="my-6 flex w-full flex-row flex-wrap gap-6"
      >
        {error && <span className="font-medium text-red-500">{error}</span>}
        {success && (
          <span className="font-medium text-green-500">
            URL:{" "}
            <a href={success} target="_blank" rel="noopener noreferrer">
              {success}
            </a>
          </span>
        )}
        <div className="w-full">
          <label htmlFor="url" className="mb-2 block text-sm font-medium">
            URL
          </label>
          <input
            type="url"
            id="url"
            name="url"
            required
            className="block w-full rounded-lg border p-2.5 text-sm "
            placeholder="https://example.com/"
          />
        </div>
        <div className="w-full md:w-1/3">
          <label htmlFor="token" className="mb-2 block text-sm font-medium">
            Token
          </label>
          <input
            type="number"
            required
            id="token"
            name="token"
            maxLength={6}
            className="block w-full rounded-lg border p-2.5 text-sm "
            placeholder="Token"
          />
        </div>
        <div className="w-full md:w-1/3">
          <label htmlFor="path" className="mb-2 block text-sm font-medium">
            Path
          </label>
          <input
            type="text"
            required
            id="path"
            name="path"
            className="block w-full rounded-lg border p-2.5 text-sm "
            placeholder="slug123"
          />
        </div>
        <div className="w-full p-4">
          <button className="rounded bg-blue-500 p-4 text-white" type="submit">
            Submit
          </button>
        </div>
      </form>
    </main>
  );
}
