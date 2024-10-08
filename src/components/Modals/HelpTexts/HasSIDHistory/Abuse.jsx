import React from 'react';

const Abuse = () => {
    return (
        <>
            <p>
                No special actions are needed to abuse this, as the kerberos
                tickets created will have all SIDs in the object's SID history
                attribute added to them; however, if traversing a domain trust
                boundary, ensure that SID filtering is not enforced, as SID
                filtering will ignore any SIDs in the SID history portion of a
                kerberos ticket.
            </p>
            <p>
                By default, SID filtering is not enabled for all domain trust
                types.
            </p>
        </>
    );
};

export default Abuse;
