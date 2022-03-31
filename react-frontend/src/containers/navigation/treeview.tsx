/**
 * @fileoverview Defines TreeView component.
 * @copyright Shingo OKAWA 2021
 */
import * as React from 'react';
import * as NextRouter from 'next/router';
import * as Props from './props';
import * as Popups from '../popups';
import * as Collapse from '../../components/collapse';
import * as Modal from '../../components/modal';
import * as FontAwesome from '@fortawesome/react-fontawesome';
import * as FontAwesomeCore from '@fortawesome/fontawesome-svg-core';
import * as FontAwesomeIcon from '@fortawesome/free-solid-svg-icons';
import * as FontAwesomeBrandIcon from '@fortawesome/free-brands-svg-icons';
import * as Context from './context';
import Link from 'next/link';
import classnames from 'classnames';
import NavigationMotion from '../../assets/motions/navigation';
import styles from '../../assets/styles/containers/navigation.module.scss';

/** Returns the corresponding FontAwesome icon. */
const getIcon = (type: Props.ItemType): FontAwesomeCore.IconDefinition => {
  switch (type) {
    case Props.ItemType.CAMERA:
      return FontAwesomeIcon.faVideo;
    case Props.ItemType.CONSTRUCTION:
      return FontAwesomeIcon.faCube;
    case Props.ItemType.GITHUB:
      return FontAwesomeBrandIcon.faGithub;
    case Props.ItemType.GITTER:
      return FontAwesomeBrandIcon.faGitter;
    case Props.ItemType.WIKI:
      return FontAwesomeIcon.faBookOpen;
    case Props.ItemType.SHARE:
      return FontAwesomeIcon.faShareSquare;
    case Props.ItemType.INFO:
      return FontAwesomeIcon.faInfo;
    case Props.ItemType.DOCUMENT:
    default:
      return FontAwesomeIcon.faFile;
  }
};

/** Returns the class name of the icon. */
const getIconClassName = (type: Props.ItemType): string =>
  classnames(styles['icon'], styles[type]);

/** Returns a `Router` component. */
export const Router: React.FunctionComponent<Props.Router> = ({
  type,
  title,
  ...linkAttrs
}: Props.Router): React.ReactElement => {
  /** @const Holds Next.js routing context. */
  const { asPath } = NextRouter.useRouter();

  return (
    <Link {...linkAttrs}>
      <div
        className={classnames(styles['item'], {
          [styles['selected'] || '']:
            asPath === linkAttrs.href || asPath === linkAttrs.as,
        })}
      >
        <span className={getIconClassName(type)}>
          <FontAwesome.FontAwesomeIcon icon={getIcon(type)} />
        </span>
        <span className={styles['title']}>{title}</span>
      </div>
    </Link>
  );
};

/** Sets the component's display name. */
Router.displayName = 'Router';

/** Returns a `ExternalLink` component. */
export const ExternalLink: React.FunctionComponent<Props.ExternalLink> = ({
  type,
  title,
  ...aAttrs
}: Props.ExternalLink): React.ReactElement => (
  <div className={styles['item']}>
    <a className={styles['link']} {...aAttrs}>
      <span className={getIconClassName(type)}>
        <FontAwesome.FontAwesomeIcon icon={getIcon(type)} />
      </span>
      <span className={styles['title']}>{title}</span>
    </a>
  </div>
);

/** Sets the component's display name. */
ExternalLink.displayName = 'Externallink';

/** Returns a `Popups` component. */
export const Popup = React.forwardRef<HTMLDivElement, Props.Popup>(
  ({ type, title, ...divAttrs }: Props.Popup, ref): React.ReactElement => (
    <div ref={ref} className={styles['item']} {...divAttrs}>
      <span className={getIconClassName(type)}>
        <FontAwesome.FontAwesomeIcon icon={getIcon(type)} />
      </span>
      <span className={styles['title']}>{title}</span>
    </div>
  )
);

/** Sets the component's display name. */
Popup.displayName = 'Popup';

/** Returns a `TreeView` component. */
export const Component: React.FunctionComponent<Props.TreeView> = (
  divProps: Props.TreeView
): React.ReactElement => {
  /** @const Holds tree-view context. */
  const { activeKeyContext } = React.useContext(Context.TreeView);

  /** @const Holds opening directory state. */
  const [activeKey, handleChange] = activeKeyContext;

  /** @const Holds a reference to the share item. */
  const share = React.useRef<Modal.Trigger>(null);

  /** Event listener which is responsible for `onClose`. */
  const handleShareClose = (): void => {
    share.current?.close();
  };

  return (
    <div {...divProps} className={styles['tree']}>
      <Collapse.Wrapper
        onChange={handleChange}
        activeKey={activeKey}
        motion={NavigationMotion}
      >
        <Collapse.Panel
          header="Menu"
          key="menu"
          showArrow={true}
          icon={FontAwesomeIcon.faHome}
        >
          <Router title="README" key="readme" type="document" href="/" />
          <Router title="WebRTC" key="webrtc" type="camera" href="/webrtc" />
          <Router title="SLAM" key="slam" type="construction" href="/slam" />
          <Router title="SfM" key="sfm" type="construction" href="/sfm" />
        </Collapse.Panel>
        <Collapse.Panel
          header="Contribution"
          key="contribution"
          showArrow={true}
          icon={FontAwesomeIcon.faUsers}
        >
          <ExternalLink
            title="Report a bug"
            key="bugreport"
            type="github"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/ognis1205/slam-at-home/issues"
          />
          <ExternalLink
            title="Get help"
            key="gethelp"
            type="gitter"
            target="_blank"
          />
          <Modal.Component
            ref={share}
            trigger={
              <Popup
                title="Share this app"
                key="share"
                type="share"
                target="_blank"
              />
            }
            modal={true}
            position={['right bottom']}
            on="click"
            offset={{ x: 0, y: 0 }}
          >
            <Popups.Share onClose={handleShareClose} />
          </Modal.Component>
        </Collapse.Panel>
        <Collapse.Panel
          header="About"
          key="about"
          showArrow={true}
          icon={FontAwesomeIcon.faInfoCircle}
        >
          <ExternalLink
            title="Github"
            key="acount"
            type="github"
            target="_blank"
            rel="noreferrer"
            href="https://github.com/ognis1205/slam-at-home"
          />
          <ExternalLink
            title="Wiki"
            key="wiki"
            type="wiki"
            target="_blank"
            rel="noreferrer"
          />
        </Collapse.Panel>
      </Collapse.Wrapper>
    </div>
  );
};

/** Sets the component's display name. */
Component.displayName = 'TreeView';
