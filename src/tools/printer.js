
import {Print} from 'expo';
export default class Printer{
  static printGradeCert(userinfo, details, summary, date){
    let printTemplate = `
    <html>
        <head>
            <style>
            @page {
                margin: 20px;
            }
            body{
                padding: 10px;
                margin: 10px;
            }
            td{
                padding: 4px
            }
            </style>
        </head>
        <body>
            <h1>성공회대학교 학내제출용 성적증명서</h1>
            <table>
                <tbody>
                    ${userinfo.map((item, index)=>`
                        <td><b>${item.name}</b></td>
                        <td style="background: silver">${item.value}</td>
                    `)}
                    </tr>
                </tbody>
            </table>
            <table>
                <tbody>
                    <tr>
                        <td>년도, 학기</td>
                        <td>과목, 과목코드</td>
                        <td>이수구분</td>
                        <td>학점</td> 
                        <td>성적등급</td> 
                    <tr>
                ${details.map((item, index)=>`
                    <tr>
                        <td>${item.year} ${item.semester}</td>
                        <td style="background: silver">${item.subject} ${item.code}</td>
                        <td>${item.type}</td>
                        <td>${item.credit}</td>
                        <td>${item.grade}</td>
                    </tr>
                `)}
                </tbody>
            </table>
            <table>
                <tbody>
                <tr>
                ${summary.map((item, index)=>`
                    <td>${item.type}</td>
                `)}
                </tr>
                <tr>
                ${summary.map((item, index)=>`
                    <td>${item.credit}</td>
                `)}
                </tr>
                </tbody>
            </table>
            <h2>${date}</h2
        </body>
    </html>
    `;

    Print.printAsync({html: printTemplate});
  }
}