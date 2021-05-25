import Head from 'next/head'
import { request } from "../lib/datocms";
import { metaTagsFragment, responsiveImageFragment } from "../lib/fragments";
import Layout from '../components/layout'
import Header from '../components/header'
import Hero from '../components/hero'
import { renderMetaTags } from "react-datocms";
import { motion } from "framer-motion"
import { fade } from "../lib/transitionHelpers"
import { signIn, signOut, useSession } from 'next-auth/client';


export default function Home({ data: {home, site} }) {

  const [session, loading] = useSession();

  return (

    <Layout>

        <Head>
            {renderMetaTags(home.seo.concat(site.faviconMetaTags))} 
        </Head>  

        {session && (
          <Header navLinks={home.heroLinks} />
        )}

        <motion.div
          initial="initial"
          animate="enter"
          exit="exit"
        >  
         
          <motion.div variants={fade}>

            {!session && (

              <div className="flex flex-col items-center justify-center w-full min-h-screen text-white bg-primary">
                      
                <img className="mx-auto mb-8" src="images/adtrak-logo.svg" width={160} height={35} alt="Adtrak Media Limited" /> 
                
                <p>Please login to see our services.</p>
                
                  <a
                    href="/api/auth/signin"
                    onClick={(e) => {
                      e.preventDefault();
                      signIn();
                    }}
                  >
                    <button className="signInButton">Sign in</button>
                  </a>

              </div>

            )}     

            {session && (
              <Hero
                index={true}
                navLinks={home.heroLinks} 
                heroTitle={home.heroTitle}
                heroImage={home.heroImage}
                heroBlurb={home.heroBlurb}
                heroBgColor="bg-primary"
                heroTextColor="text-white"
                heroLinks={home.heroLinks}
              />
            )}

          </motion.div>

        </motion.div>
        
    </Layout>

  )
}

const HOMEPAGE_QUERY = `
  query HomePage {
    site: _site {
      faviconMetaTags {
        ...metaTagsFragment
      }
    }
    home {
      heroTitle
      heroBlurb
      heroImage {
        responsiveImage(imgixParams: {fm: png, w:1920, h:796, crop: entropy, fit: crop }) {
          ...responsiveImageFragment
        }
      }
      heroLinks {
        ... on HostingRecord {
          pageTitle
          heroTitle
          slug
        }
        ... on InternetMarketingRecord {
          pageTitle
          heroTitle
          slug
        }
        ... on WebDesignRecord {
          pageTitle
          heroTitle
          slug
        }
      }
      seo: _seoMetaTags {
        ...metaTagsFragment
      }
    }
  }
  ${metaTagsFragment}
  ${responsiveImageFragment}
`

export async function getStaticProps() {
  const data = await request({
    query: HOMEPAGE_QUERY
  })
  return {
    props: { data }
  }
}
