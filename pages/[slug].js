import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head'
import { request } from "../lib/datocms";
import { renderMetaTags } from "react-datocms";
import { metaTagsFragment, responsiveImageFragment } from "../lib/fragments";
import { fade, tierVariants, listVariants, featureVariants } from "../lib/transitionHelpers"
import Layout from '../components/layout'
import Header from '../components/header'
import Hero from '../components/hero'
import Login from '../components/login'
import Footer from '../components/footer'
import Container from '../components/container'
import IconThumb from '../components/iconThumb'
import { m, motion } from 'framer-motion'
import Feature from "../components/feature";
import MostPopular from "../components/most-popular";
import { useSession } from 'next-auth/client';
import { HeroContext } from '../context/HeroContext'

export default function Page ({ data : { site, page, home } }) {

    const router = useRouter();

    const heroColours = [
      {
        "hexColor": "18, 40, 76",
        "bgColor": "bg-secondary-dark",
        "textColor": "text-white",
        "mostPopularColor": "bg-primary border-primary"
      },
      {
        "hexColor": "59, 92, 196",
        "bgColor": "bg-secondary",
        "textColor": "text-white",
        "mostPopularColor": "bg-primary border-primary"
      },
      {
        "hexColor": "255, 107, 74",
        "bgColor": "bg-primary",
        "textColor": "text-white",
        "mostPopularColor": "bg-secondary border-secondary"
      }      
    ];

    // const [randomNumber, setRandomNumber] = useState(0);
    const [heroContext, setHeroContext] = useContext(HeroContext);
    
    function getRandomNumber(min, max) {
      return Math.random() * (max - min) + min;
    }
        
    useEffect(() => {
      router.events.on('routeChangeComplete', () => {
        setHeroContext(Math.floor(getRandomNumber(0, 3)));
      })
    }, []);

    const [session, loading] = useSession();
    const [modal, showModal] = useState(false);

    function handleModal(desc) {
        showModal(true);
        document.querySelector('.modal-content').innerHTML = desc;
    }

    function handleClose() {
        showModal(false);
    }  
    
    return(
        <Layout>

        <Head>
            {renderMetaTags(page.seo.concat(site.faviconMetaTags))} 
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
            <Login />
          )} 


          {session && (
            <>
              <Hero
                navLinks={home.heroLinks} 
                heroImage={page.heroImage}
                heroTitle={page.heroTitle}
                heroBlurb={page.heroBlurb}
                heroTextColor={heroColours[heroContext].textColor}
                heroBgColor={heroColours[heroContext].bgColor}
                heroGradientHex={heroColours[heroContext].hexColor}
                heroModifiers="pb-[320px]"
              />        

              <div className="w-full bg-white">

                <Container>

                  <div className="relative z-20 flex flex-wrap text-2xs hosting-options lg:text-base">

                    <motion.ul 
                      className="relative w-5/12 option-list"
                      initial="hidden"
                      animate="visible"
                      variants={listVariants}
                    >
                      {page.features.map((option, i) => {
                        return (
                          <motion.li variants={featureVariants} key={i}>
                            <span className="relative z-10">{option.title}</span>
                            <button className="relative z-50 ml-4 transition-all duration-1000 opacity-50 text-2xs hover:opacity-100" aria-label="Expand information" onClick={() => handleModal(option.description)}>
                              <img className="w-4 h-4 text-primary" src={`images/icon-info.svg`} alt="View more information" />
                            </button>
                          </motion.li>
                        )
                      })}
                    </motion.ul>

                    <div className="w-7/12">

                      <div className="flex flex-wrap w-full h-full">

                        {page.linkedTiers.map((tier, i) => {
                          
                          let tierLength = page.linkedTiers.length;
                          let columnWidth;
                          let serviceFeatures = Object.keys(tier);
                          let excludedFeatures = [
                            'title',
                            'mostPopular',
                            'price',
                            'nickname',
                            '',
                            ''
                          ];

                          switch(tierLength) {
                            case 2:
                              columnWidth = "w-1/2"
                              break;
                            case 3:
                              columnWidth = "w-1/3"
                              break;
                            case 4:
                              columnWidth = "w-1/4"
                              break;
                            case 5:
                              columnWidth = "w-1/5"
                              break;
                            case 6:
                              columnWidth = "w-1/6"
                              break;
                            default: 
                              columnWidth = "w-1/2";
                          }
                          
                          return (
                            
                          <div className={columnWidth} key={i}>

                            <motion.div 
                              key={tier.title}
                              initial="hidden"
                              animate="visible"
                              variants={tierVariants}
                              transition={{duration: .5, delay: 2.5}}
                              className={`flex flex-col items-center leading-snug text-center border-l border-b  ${tier.mostPopular ? `rounded-t-4xl mt-[-141px] lg:mt-[-163px] xl:mt-[-169px] py-4 ${heroColours[heroContext].mostPopularColor} text-white` : 'mt-[-109px] lg:mt-[-131px] xl:mt-[-137px] bg-white text-secondary-dark border-gray-200'} ${i == 0 ? 'rounded-tl-4xl' : '' } ${i+1 == page.linkedTiers.length ? 'rounded-tr-4xl' : ''} `}>
                              
                              <div className="relative w-full py-6">
                                
                                {tier.mostPopular &&
                                  <MostPopular />
                                }
                                
                                <p className="px-2 leading-tight text-center">
                                  <span className="text-xs font-semibold opacity-50 font-display">{tier.title}</span>
                                </p>
                                <p className="flex flex-col leading-tight">
                                  <span className="py-2 text-lg font-semibold leading-none xl:text-xl font-display">{tier.price}</span>
                                  
                                  {tier.nickname &&
                                    <span className="hidden font-light opacity-50 text-2xs lg:block">{tier.nickname}</span>
                                  }
                                </p>
                              </div>
                              
                            </motion.div>
                            

                             <motion.ul
                              className={` ${i+1 <= page.linkedTiers.length ? 'border-l border-gray-200' : '' } ${i === page.linkedTiers.length ? 'border-l-0' : '' } ${tier.mostPopular ? "shadow-xl rounded-3xl pb-4 text-xs relative z-40 border-l-0" : "text-xs"} overflow-hidden`}
                              initial="hidden"
                              animate="visible"
                              variants={listVariants}
                            >

                              {serviceFeatures.map((feature, index) => {
                                if(!excludedFeatures.includes(feature)) {
                                  let isString = typeof tier[feature] == "string" ? true : false;
                                  return(
                                    <Feature key={index} feature={tier[feature]} text={isString ? true : false} /> 
                                  )
                                }
                              })}

                            </motion.ul> 
                            
                          </div>
                          )
                        })}

                        

                      </div>

                    </div>

                  </div>

                </Container>
                
              </div>        

              <Footer content={page.disclaimer} />

            </>
            )}

            </motion.div>

            <motion.div className={`modal fixed z-50 p-4 bg-primary text-white text-center transition-all duration-1000 bottom-0 left-0 w-full text-2xs ${modal ? 'opacity-full' : 'opacity-0'}`}>
              <>
                <button className="absolute top-4 right-4" onClick={() => handleClose()}>Close</button>
                <p className="modal-content">...</p>
              </>
            </motion.div>       

      </motion.div>

    </Layout>
    )
};

const QUERY = `
    query Page($slug: String) {
        site: _site {
            faviconMetaTags {
                ...metaTagsFragment
            }
        }
        page(filter: {slug: {eq: $slug}}) {
            heroTitle
            heroBlurb
            heroImage {
                responsiveImage(imgixParams: {fm: png, w:900, h:750, crop: entropy, fit: crop, blendMode: multiply}) {
                ...responsiveImageFragment
                }
            }
            features {
                title
                description
            }
            linkedTiers {
              ... on HostingOptionRecord {
                title
                mostPopular
                price
                nickname
                freeSslCertificate
                backups
                uptime
                unlimitedVisitors
                protectedNameservers
                dedicatedDdosProtection
                recommendedForEcommerce
                reactiveServerMonitoring
                threatProtection
              }
              ... on InternetMarketingTierRecord {
                title
                mostPopular
                price
                nickname
                healthChecks
                analyticsAnalysis
                algorithmCompliance
                citationBuildingMaintenance
                googleMyBusiness
                quarterlyPerformanceReview
                rankTracking
                ongoingOptimisation
                backlinkProfileAnalysis
                advancedLinkBuilding
                articleManagement
                reviewsManagement
                siteSpeedManagement
                contentMarketing
                uxAnalysis
                cro
                extendedLandingPages
                digitalPr
                graphicDesign
                organicSocialMedia
                paidSocialMedia
                photography
                videography
                animation
              }
              ... on PaidMarketingTierRecord {
                title
                mostPopular
                price
                nickname
                managementFee
                minimumAdSpend
                goalTracking
                quarterlyReporting
                negativeKeywords
                keywordBidCheck
                budgetChecks
                googleAdScripts
                campaignUpdates
                removeUnderperformingKeywords
                keywordCtrChecks
                clickFraudProtection
                locations
                dedicatedConsultant
                impressionShareAnalysis
                competitorAnalysis
                brandCampaigns
                advertCopyOptimisation
                advertPositionOptimisation
                adgroupSplitting
                landingPageOptimisation
                campaignTests
                auctionInsightsReport
                accessToBetaApplications
                demographicsAnalysis
                multiChannelPerformance
                crossDeviceConversionPaths
                analyticsAccess
                advancedTelecomsAnalysis
                youtubeAdvertising
                facebookAds
                linkedinAds
                microsoftAdsSetup
                splitTestingSoftware
                googleDisplayNetwork
                remarketingListForSearchAds
                shoppingAds
              }
              ... on SocialTierRecord {
                title
                mostPopular
                price
                nickname
                boostingBudgetForPromotedPosts
                brandedGraphics
                communityEngagement
                inboxAutoResponding
                jobPostings    
                notificationMonitoring
                numberOfPosts
                numberOfSocialMediaPlatforms
                quarterlyReporting
                schedulingToolAccess
              }
              ... on WebDesignTierRecord {
                title
                mostPopular
                price
                nickname
                dedicatedAccountManager
                contentManagementSystem
                freeSslCertificate
                freeSeoSetup
                professionalCopywriting
                contactAndQuickQuoteForms
                responsiveDesignOptimisedForMobileDevices
                changeImagesAndColours
                customSitemap
                layoutAmendments
                uxWorkshop
                bespokeDesign
                advancedFeaturesIntegrations
                socialMediaIntegration
                secureOnlinePayments
              }
              ... on PaidSocialTierRecord {
                title
                mostPopular
                price
                nickname
                numberOfSocialMediaPlatforms
                recommendedAdSpend
                campaigns
                performanceMonitoring
                performanceAnalysis
                quarterlyReporting
                adSplitTesting
                remarketingAdvertising
                lookalikeAudiences
                jobPostings
                shoppableAds
                sequentialAdvertising
              }
            }
            disclaimer
            seo: _seoMetaTags {
                ...metaTagsFragment
            }
        }
        home {
          heroLinks {
            slug
            pageTitle
          }
        }
        
    }
    ${metaTagsFragment}
    ${responsiveImageFragment}
`

export async function getStaticProps({ params }) {
    const slug = params;
    
    const data = await request({
        query: QUERY,
        variables: slug,
    });
    
    return {
        props: { data }
    }
}


export async function  getStaticPaths() {
    const data = await request( {
        query: `{ allPages { slug } }` 
    });
    return {
        paths: data.allPages.map((page) => `/${page.slug}`),
        fallback: false,
    }
}

