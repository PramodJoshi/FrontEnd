import React, { useEffect } from 'react';
import cx from 'classnames';
import { CTFragment, CTHeading } from 'layout';
import { epub, connectWithRedux } from '../../controllers';
import NavigationTrigger from './NavigationTrigger';
import NavigationMenu from './NavigationMenu'


function NavigationProvider({
  // states
  chapters,
  showNav,
  currChIndex,
  // user props
  wider,
  defaultClosed,
  children
}) {
  useEffect(() => {
    if (chapters.length > 0) {
      epub.state.setNavId(epub.id.chNavItemID(chapters[currChIndex].id));
    }

    if (defaultClosed) {
      epub.state.setShowNav(false);
    }
  }, []);

  const hidden = showNav ? "false" : "true";

  return (
    <CTFragment id={epub.id.EPubNavigationProviderID} dFlex className={cx({ wider })}>
      <NavigationTrigger show={showNav} />

      <div aria-hidden={hidden} className={cx('ct-epb nav-con', { show: showNav })}>
        <CTHeading as="h3" uppercase sticky fadeIn={false}>Chapters</CTHeading>
        <NavigationMenu />
      </div>

      <div className={cx('ct-epb nav-main', { 'show-nav': showNav })}>
        {children}
      </div>
    </CTFragment>
  );
}

export default connectWithRedux(
  NavigationProvider,
  ['showNav', 'chapters', 'currChIndex']
);
