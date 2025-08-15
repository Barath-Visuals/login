import React from 'react';
import styles from "../StyleSCSS/AttendanceSection.module.scss";

const AttendanceSection = () => {
  return (
    <div className={styles.section121}>
      <div className={styles.rectangle68}></div>

      <div className={styles.frame39}>
        <div className={styles.frame37}>
          <div className={styles.frame36}>
            <div className={styles.officeDetails}>Office Details</div>
            <div className={styles.frame35}>
              <div className={styles.barathBM}>Barath B M</div>
              <div className={styles.designer}>Designer</div>
            </div>
          </div>
          <div className={styles.active}>Active</div>
        </div>

        <div className={styles.frame34}>
          <div className={styles.personalDetails}>Personal Details</div>
          <div className={styles.frame33}>
            <div className={styles.n21}>21</div>
            <div className={styles.n6382890423}>6382890423</div>
            <div className={styles.gandhinagarChettiyarmadam}>
              Gandhinagar, Chettiyarmadam
            </div>
          </div>
        </div>
      </div>

      <div className={styles.rectangle70}></div>
      <div className={styles.rectangle71}></div>

      <div className={styles.calendar}>
        <div className={styles.rectangle53}></div>
        <div className={styles.rectangle55}></div>
        <div className={styles.n31}>31</div>
        <div className={styles.rectangle54}></div>
        <div className={styles.n30}>30</div>
        <div className={styles.rectangle48}></div>
        <div className={styles.n29}>29</div>
        <div className={styles.rectangle57}></div>
        <div className={styles.n2}>2</div>
        <div className={styles.rectangle56}></div>
        <div className={styles.n1}>1</div>

        <div className={styles.group81}>
          <div className={styles.rectangle482}></div>
          <div className={styles.n7}>7</div>
        </div>

        <div className={styles.rectangle532}></div>
        <div className={styles.done}>Done</div>

        <div className={styles.date}>
          <div className={styles.rectangle483}></div>
          <div className={styles.mo}>Mo</div>
        </div>

        {['Tu', 'Tu', 'Th', 'Fr', 'Sa', 'Su'].map((day, index) => (
          <div className={styles[`component${index + 2}`]} key={index}>
            <div className={styles.rectangle483}></div>
            <div className={styles[`mo${index + 2}`]}>{day}</div>
          </div>
        ))}

        <img className={styles.line5} src="line-50.svg" alt="line" />

        <div className={styles.months}>
          <div className={styles.january2023}>January 2023</div>
          <div className={styles.frame21}>
            <div className={styles.rectangle562}></div>
            <img className={styles.group71} src="group-710.svg" alt="left" />
          </div>
          <div className={styles.rectangle542}></div>
          <img className={styles.group72} src="group-720.svg" alt="right" />
        </div>

        {[1, 2, 3, 4, 11, 10, 9, 8, 6, 5, 12, 13, 14, 15, 16, 17, 18, 20, 21, 22, 23, 24, 25, 19, 26, 27, 28, 29, 30].map((day, index) => (
          <div className={styles[`numbers${index}`]} key={day}>
            <div className={styles.rectangle483}></div>
            <div className={styles.n13}>{day}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AttendanceSection;
