import React from 'react';
import PropTypes from 'prop-types';

const Abuse = ({ sourceName, sourceType, targetName }) => {
    return (
        <>
            <p>
                Abuse of this privilege will depend heavily on the type of
                access you have.
            </p>
            <h4>PlainText Credentials with Interactive Access</h4>
            <p>
                With plaintext credentials, the easiest way to exploit this
                privilege is using the built in Windows Remote Desktop Client
                (mstsc.exe). Open mstsc.exe and input the computer {targetName}.
                When prompted for credentials, input the credentials for{' '}
                {sourceType === 'Group'
                    ? `a member of ${sourceName}`
                    : `${sourceName}`}{' '}
                to initiate the remote desktop connection.
            </p>
            <h4>Password Hash with Interactive Access</h4>
            <p>
                With a password hash, exploitation of this privilege will
                require local administrator privileges on a system, and the
                remote server must allow Restricted Admin Mode.
            </p>
            <p>
                First, inject the NTLM credential for the user you're abusing
                into memory using mimikatz:
            </p>
            <pre>
                <code>
                    {
                        'lsadump::pth /user:dfm /domain:testlab.local /ntlm:&lt;ntlm hash&gt; /run:"mstsc.exe /restrictedadmin"'
                    }
                </code>
            </pre>
            <p>
                This will open a new RDP window. Input the computer {targetName}{' '}
                to initiate the remote desktop connection. If the target server
                does not support Restricted Admin Mode, the session will fail.
            </p>
            <h4>Plaintext Credentials without Interactive Access</h4>
            <p>
                This method will require some method of proxying traffic into
                the network, such as the socks command in cobaltstrike, or
                direct internet connection to the target network, as well as the
                xfreerdp (suggested because of support of Network Level
                Authentication (NLA)) tool, which can be installed from the
                freerdp-x11 package. If using socks, ensure that proxychains is
                configured properly. Initiate the remote desktop connection with
                the following command:
            </p>
            <pre>
                <code>
                    {
                        '(proxychains) xfreerdp /u:dfm /d:testlab.local /v:<computer ip>'
                    }
                </code>
            </pre>
            <p>
                xfreerdp will prompt you for a password, and then initiate the
                remote desktop connection.
            </p>
            <h4>Password Hash without Interactive Access</h4>
            <p>
                This method will require some method of proxying traffic into
                the network, such as the socks command in cobaltstrike, or
                direct internet connection to the target network, as well as the
                xfreerdp (suggested because of support of Network Level
                Authentication (NLA)) tool, which can be installed from the
                freerdp-x11 package. Additionally, the target computer must
                allow Restricted Admin Mode. If using socks, ensure that
                proxychains is configured properly. Initiate the remote desktop
                connection with the following command:
            </p>
            <pre>
                <code>
                    {
                        '(proxychains) xfreerdp /pth:<ntlm hash> /u:dfm /d:testlab.local /v:<computer ip>'
                    }
                </code>
            </pre>
            <p>
                This will initiate the remote desktop connection, and will fail
                if Restricted Admin Mode is not enabled.
            </p>
        </>
    );
};

Abuse.propTypes = {
    sourceName: PropTypes.string,
    sourceType: PropTypes.string,
    targetName: PropTypes.string,
};

export default Abuse;
