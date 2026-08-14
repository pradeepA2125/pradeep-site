import { site } from "../content";
import Section from "./Section";

export default function Riding() {
  const { heading, body, photo } = site.riding;

  return (
    <Section id="riding" eyebrow="Getting away from screens" title={heading}>
      <div className="grid gap-8 md:grid-cols-2 md:items-center">
        {/*
          The bike shot is a tall portrait; at full column width it towers over
          a three-line paragraph and leaves the text stranded in whitespace.
          Capping the height keeps the two columns in proportion.
        */}
        <img
          src={photo.src}
          alt={photo.alt}
          width={photo.width}
          height={photo.height}
          loading="lazy"
          decoding="async"
          className="max-h-[26rem] w-full rounded object-cover object-top md:order-last md:max-h-[30rem]"
        />
        <p className="text-ink-2">{body}</p>
      </div>
    </Section>
  );
}
