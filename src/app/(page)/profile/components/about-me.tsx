import { H4, P } from '@/components/ui/typography';
import { Pen } from 'lucide-react';
import React from 'react';

const AboutMe = () => {
  return (
    <div>
      <div className="flex justify-between">
        <H4 className="mb-3">About</H4>
        <div className="cursor-pointer">
          <Pen className="size-5" />
        </div>
      </div>
      <P>
        With over 13 years of professional experience in web development, Cons has developed deep expertise in front-end
        technologies. This includes proficiency in modern web development tools and frameworks such as HTML5, CSS,
        Bootstrap, and React TypeScript. Cons is skilled at implementing dynamic, responsive, and user-friendly
        interfaces, utilizing AJAX, JSON, and various JavaScript libraries like jQuery, KnockoutJS, and jQuery Mobile.
      </P>
      <P>
        While Cons&#39 primary focus is on front-end development, they also have some experience in back-end
        programming, having worked with technologies such as PHP, Java, and C#. This experience has provided a solid
        understanding of the full-stack development process, allowing for better collaboration with back-end teams and
        more comprehensive project contributions.
      </P>
      <P>
        Cons has also worked with various content management systems (CMS), particularly Joomla, WordPress, and Liferay,
        enabling the development and management of complex websites tailored to meet diverse client needs.
      </P>
      <P>
        Currently, Cons specializes as a front-end developer with a focus on the React TypeScript library, continually
        pushing the boundaries of web development by creating scalable, maintainable, and high-performance web
        applications.
      </P>
      <P>
        Cons holds a Bachelor of Science degree in Computer Science from Holy Name University in Tagbilaran City, Bohol.
        This academic foundation, combined with extensive hands-on experience, positions Cons as a seasoned professional
        in the field, ready to tackle new challenges and contribute to innovative web solutions.
      </P>
    </div>
  );
};

export default AboutMe;
