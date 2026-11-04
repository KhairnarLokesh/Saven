export interface ProjectInquiryData {
  fullName: string;
  email: string;
  company: string;
  phone: string;
  service: string;
  description: string;
}

export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function renderProjectInquiryHtml(data: ProjectInquiryData): string {
  const safeFullName = escapeHtml(data.fullName);
  const safeEmail = escapeHtml(data.email);
  const safeCompany = escapeHtml(data.company || 'Not provided');
  const safePhone = escapeHtml(data.phone || 'Not provided');
  const safeService = escapeHtml(data.service);
  const safeDescription = escapeHtml(data.description).replace(/\n/g, '<br />');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>New Project Inquiry | SAVEN Studios</title>
</head>

<body style="
  margin: 0;
  padding: 30px 12px;
  background-color: #080808;
  font-family: Arial, Helvetica, sans-serif;
  color: #ffffff;
">

  <!-- Main Wrapper -->
  <table
    role="presentation"
    width="100%"
    cellpadding="0"
    cellspacing="0"
    border="0"
    style="background-color:#080808;"
  >
    <tr>
      <td align="center">

        <!-- Email Container -->
        <table
          role="presentation"
          width="100%"
          cellpadding="0"
          cellspacing="0"
          border="0"
          style="
            max-width:620px;
            background-color:#0d0d0d;
            border:1px solid #292929;
          "
        >

          <!-- HEADER -->
          <tr>
            <td style="padding:38px 35px 25px;">

              <div style="
                font-size:29px;
                letter-spacing:12px;
                font-weight:300;
                color:#ffffff;
              ">
                SAVEN
              </div>

              <p style="
                margin:9px 0 0;
                font-size:10px;
                letter-spacing:4px;
                color:#888888;
              ">
                STUDIOS
              </p>

              <div style="
                margin-top:30px;
                height:1px;
                background-color:#292929;
                font-size:0;
                line-height:0;
              ">
                &nbsp;
              </div>

            </td>
          </tr>

          <!-- NEW ENQUIRY STATUS -->
          <tr>
            <td style="padding:5px 35px 28px;">

              <table role="presentation" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="
                    padding:8px 13px;
                    border:1px solid #31523c;
                    color:#79c995;
                    font-size:10px;
                    letter-spacing:2px;
                  ">
                    &#9679;&nbsp; NEW ENQUIRY
                  </td>
                </tr>
              </table>

              <h1 style="
                margin:24px 0 10px;
                font-size:28px;
                line-height:1.35;
                font-weight:400;
                color:#ffffff;
              ">
                New Project Inquiry
              </h1>

              <p style="
                margin:0;
                font-size:14px;
                line-height:1.8;
                color:#999999;
              ">
                A new project inquiry has been submitted through
                the SAVEN Studios website. Here are the details
                provided by the prospective client.
              </p>

            </td>
          </tr>

          <!-- CLIENT INFORMATION -->
          <tr>
            <td style="padding:10px 35px 30px;">

              <h2 style="
                margin:0 0 20px;
                font-size:12px;
                font-weight:500;
                letter-spacing:2px;
                color:#aaaaaa;
              ">
                01 / CLIENT INFORMATION
              </h2>

              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
              >

                <!-- Full Name -->
                <tr>
                  <td style="
                    padding:14px 0;
                    border-bottom:1px solid #252525;
                  ">
                    <div style="
                      font-size:10px;
                      letter-spacing:1.5px;
                      color:#777777;
                    ">
                      FULL NAME
                    </div>

                    <div style="
                      margin-top:7px;
                      font-size:15px;
                      line-height:1.5;
                      color:#ffffff;
                    ">
                      ${safeFullName}
                    </div>
                  </td>
                </tr>

                <!-- Email -->
                <tr>
                  <td style="
                    padding:14px 0;
                    border-bottom:1px solid #252525;
                  ">
                    <div style="
                      font-size:10px;
                      letter-spacing:1.5px;
                      color:#777777;
                    ">
                      EMAIL ADDRESS
                    </div>

                    <div style="
                      margin-top:7px;
                      font-size:15px;
                      line-height:1.5;
                      color:#ffffff;
                    ">
                      ${safeEmail}
                    </div>
                  </td>
                </tr>

                <!-- Company -->
                <tr>
                  <td style="
                    padding:14px 0;
                    border-bottom:1px solid #252525;
                  ">
                    <div style="
                      font-size:10px;
                      letter-spacing:1.5px;
                      color:#777777;
                    ">
                      COMPANY / ORGANIZATION
                    </div>

                    <div style="
                      margin-top:7px;
                      font-size:15px;
                      line-height:1.5;
                      color:#ffffff;
                    ">
                      ${safeCompany}
                    </div>
                  </td>
                </tr>

                <!-- Phone -->
                <tr>
                  <td style="
                    padding:14px 0;
                    border-bottom:1px solid #252525;
                  ">
                    <div style="
                      font-size:10px;
                      letter-spacing:1.5px;
                      color:#777777;
                    ">
                      PHONE NUMBER
                    </div>

                    <div style="
                      margin-top:7px;
                      font-size:15px;
                      line-height:1.5;
                      color:#ffffff;
                    ">
                      ${safePhone}
                    </div>
                  </td>
                </tr>

              </table>

            </td>
          </tr>

          <!-- PROJECT DETAILS -->
          <tr>
            <td style="padding:5px 35px 35px;">

              <h2 style="
                margin:0 0 20px;
                font-size:12px;
                font-weight:500;
                letter-spacing:2px;
                color:#aaaaaa;
              ">
                02 / PROJECT DETAILS
              </h2>

              <!-- Selected Service -->
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  background-color:#141414;
                  border:1px solid #292929;
                "
              >
                <tr>
                  <td style="padding:20px;">

                    <div style="
                      font-size:10px;
                      letter-spacing:1.5px;
                      color:#777777;
                    ">
                      SELECTED SERVICE
                    </div>

                    <div style="
                      margin-top:10px;
                      font-size:16px;
                      line-height:1.5;
                      color:#ffffff;
                    ">
                      ${safeService}
                    </div>

                  </td>
                </tr>
              </table>

              <!-- Project Description -->
              <table
                role="presentation"
                width="100%"
                cellpadding="0"
                cellspacing="0"
                border="0"
                style="
                  margin-top:18px;
                  background-color:#141414;
                  border:1px solid #292929;
                "
              >
                <tr>
                  <td style="padding:20px;">

                    <div style="
                      font-size:10px;
                      letter-spacing:1.5px;
                      color:#777777;
                    ">
                      PROJECT DESCRIPTION &amp; REQUIREMENTS
                    </div>

                    <div style="
                      margin-top:14px;
                      font-size:14px;
                      line-height:1.9;
                      color:#dddddd;
                      overflow-wrap:anywhere;
                    ">
                      ${safeDescription}
                    </div>

                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="padding:0 35px 35px;">

              <div style="
                height:1px;
                background-color:#292929;
                font-size:0;
                line-height:0;
              ">
                &nbsp;
              </div>

              <p style="
                margin:25px 0 0;
                font-size:12px;
                line-height:1.8;
                color:#888888;
              ">
                This inquiry was submitted through the official
                SAVEN Studios website.
              </p>

              <p style="
                margin:20px 0 0;
                font-size:17px;
                font-weight:400;
                color:#ffffff;
              ">
                Your Ambition, Our Architecture.
              </p>

              <p style="
                margin:13px 0 0;
                font-size:10px;
                letter-spacing:3px;
                color:#666666;
              ">
                BUILD. ENHANCE. EVOLVE.
              </p>

              <p style="
                margin:30px 0 0;
                font-size:10px;
                line-height:1.6;
                color:#555555;
              ">
                &copy; 2026 SAVEN Studios. All rights reserved.
              </p>

            </td>
          </tr>

        </table>
        <!-- End Email Container -->

      </td>
    </tr>
  </table>

</body>
</html>`;
}

export function renderProjectInquiryText(data: ProjectInquiryData): string {
  return [
    'SAVEN STUDIOS',
    '● NEW ENQUIRY',
    '',
    'NEW PROJECT INQUIRY',
    'A new project inquiry has been submitted through the SAVEN Studios website.',
    '',
    '01 / CLIENT INFORMATION',
    '--------------------------------------------------',
    `Full Name             : ${data.fullName}`,
    `Email Address         : ${data.email}`,
    `Company / Organization: ${data.company || 'Not provided'}`,
    `Phone Number          : ${data.phone || 'Not provided'}`,
    '',
    '02 / PROJECT DETAILS',
    '--------------------------------------------------',
    `Selected Service      : ${data.service}`,
    '',
    'Project Description & Requirements:',
    data.description,
    '',
    '--------------------------------------------------',
    'This inquiry was submitted through the official SAVEN Studios website.',
    'Your Ambition, Our Architecture.',
    'BUILD. ENHANCE. EVOLVE.',
    '© 2026 SAVEN Studios. All rights reserved.',
  ].join('\n');
}

