import AboutClient from '@/app/about/AboutClient';

export const metadata = {
  title: 'About | The Paradise',
  description: 'Meet the cast and crew of The Paradise',
};

export default function AboutPage() {
  const castAndCrew = [
    {
      name: 'Srikanth Odela',
      role: 'Director',
      image: 'https://pbs.twimg.com/profile_images/1975840106415280128/j889lc1E_400x400.jpg',
    },
    {
      name: 'Nani',
      role: 'as Jadal',
      image: '/assets/merch/New-Year-The-Paradise-WWM.jpg',
    },
    {
      name: 'Kayadu Lohar',
      role: 'as Subbu',
      image: '/assets/about/Paradise Subbu flat.jpg',
    },
    {
      name: 'Raghav Juyal',
      role: 'as Vikram Maalik',
      image: '/assets/about/Raghav-Juyal.jpg',
    },
    {
      name: 'Mohan Babu',
      role: 'as Shikanja Malik',
      image: 'https://instagram.fvtz5-1.fna.fbcdn.net/v/t51.82787-15/554697260_18553401049008126_2136274903506269763_n.jpg?stp=dst-jpg_e35_tt6&_nc_cat=105&ig_cache_key=MzczMDY3NjI5MDgyNDU1NTA4NA%3D%3D.3-ccb7-5&ccb=7-5&_nc_sid=58cdad&efg=eyJ2ZW5jb2RlX3RhZyI6IkZFRUQueHBpZHMuMTQ0MC5zZHIucmVndWxhcl9waG90by5DMyJ9&_nc_ohc=Df9rnxOUWzoQ7kNvwEPpp0J&_nc_oc=AdrGUpI0NcZudKMZqAFrfX1oR5ymrOfoFYhmwdNWX2QEHB6kNPqI-fWV1iYLdNchEmw&_nc_ad=z-m&_nc_cid=0&_nc_zt=23&_nc_ht=instagram.fvtz5-1.fna&_nc_gid=20zw2FFSCE1O8mindqIXPA&_nc_ss=7a22e&oh=00_AQAW5yWU0RrndkN9x7HNf2a9QJEpXF79FIJkCkSD8Sx5SQ&oe=6A6C66D7',
    },
    {
      name: 'Sampurnesh Babu',
      role: 'as Biryani',
      image: '/assets/about/Paradise Biriyani plain.jpg',
    }
  ];

  return <AboutClient items={castAndCrew} />;
}

